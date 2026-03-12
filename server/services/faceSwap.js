// tryOn.js — Virtual try-on via Replicate IDM-VTON with pre-processing
import Replicate from 'replicate'
import fetch from 'node-fetch'
import sharp from 'sharp'

const VTON_MODEL = 'cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985'
const REMBG_MODEL = 'cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003'

// Target dimensions for IDM-VTON (3:4 ratio)
const TARGET_W = 768
const TARGET_H = 1024

export async function tryOnClothes(personBuffer, garmentBuffer, category, garmentDesc) {
  const token = process.env.REPLICATE_API_TOKEN
  if (!token || token === 'your_token_here') {
    throw new Error('REPLICATE_API_TOKEN is required.')
  }

  const replicate = new Replicate({ auth: token })

  // Step 1: Analyze person image aspect ratio
  const personMeta = await sharp(personBuffer).metadata()
  const personRatio = personMeta.width / personMeta.height
  const isAlready3x4 = Math.abs(personRatio - 0.75) < 0.05
  const needsCrop = !isAlready3x4

  console.log(`[1/4] Person image: ${personMeta.width}x${personMeta.height} ratio=${personRatio.toFixed(2)} needsCrop=${needsCrop}`)

  // Pad to 3:4 instead of cropping — preserves full body for any pose
  const personProcessed = await padPersonTo3x4(personBuffer)

  // Step 2: Remove garment background → clean white background
  console.log('[2/4] Removing garment background...')
  const garmentClean = await removeBackground(replicate, garmentBuffer)

  // Step 3: Resize garment to 3:4
  console.log('[3/4] Resizing garment to 768x1024...')
  const garmentProcessed = await padGarmentTo3x4(garmentClean)

  // Step 4: Run IDM-VTON
  const personB64 = `data:image/jpeg;base64,${personProcessed.toString('base64')}`
  const garmentB64 = `data:image/png;base64,${garmentProcessed.toString('base64')}`

  console.log(`[4/4] Running IDM-VTON: category=${category}, crop=${needsCrop}, desc="${garmentDesc}"`)

  const output = await replicate.run(VTON_MODEL, {
    input: {
      human_img: personB64,
      garm_img: garmentB64,
      category: category || 'upper_body',
      garment_des: garmentDesc || 'clothing item',
      // crop=true lets the model auto-detect body region for non-standard poses
      crop: needsCrop,
      steps: 40,
      seed: 0
    }
  })

  const resultUrl = String(output)
  console.log('Result URL:', resultUrl.slice(0, 80))

  const response = await fetch(resultUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch result image: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

// Pad person image onto neutral background to 3:4 ratio — preserves full body
async function padPersonTo3x4(buffer) {
  const meta = await sharp(buffer).metadata()
  const targetRatio = TARGET_W / TARGET_H // 0.75

  let resizeW, resizeH
  const imgRatio = meta.width / meta.height

  if (imgRatio > targetRatio) {
    // Image is wider than 3:4 → fit by width, pad top/bottom
    resizeW = TARGET_W
    resizeH = Math.round(TARGET_W / imgRatio)
  } else {
    // Image is taller than 3:4 → fit by height, pad left/right
    resizeH = TARGET_H
    resizeW = Math.round(TARGET_H * imgRatio)
  }

  // Resize then pad onto neutral background
  const resized = await sharp(buffer)
    .resize(resizeW, resizeH, { fit: 'inside' })
    .toBuffer()

  return sharp({
    create: {
      width: TARGET_W,
      height: TARGET_H,
      channels: 3,
      background: { r: 240, g: 240, b: 240 }
    }
  })
    .composite([{
      input: resized,
      gravity: 'north' // Anchor to top so head stays at top of frame
    }])
    .jpeg({ quality: 95 })
    .toBuffer()
}

// Remove background using Replicate's rembg, then place on white
async function removeBackground(replicate, buffer) {
  const b64 = `data:image/jpeg;base64,${buffer.toString('base64')}`

  try {
    const output = await replicate.run(REMBG_MODEL, {
      input: { image: b64 }
    })

    const resultUrl = String(output)
    const response = await fetch(resultUrl)
    if (!response.ok) {
      throw new Error(`rembg fetch failed: ${response.status}`)
    }

    // rembg returns PNG with transparent background → composite on white
    const transparentBuf = Buffer.from(await response.arrayBuffer())
    const meta = await sharp(transparentBuf).metadata()

    return sharp({
      create: {
        width: meta.width,
        height: meta.height,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
      .composite([{ input: transparentBuf }])
      .png()
      .toBuffer()
  } catch (err) {
    console.warn('Background removal failed, using original:', err.message)
    return buffer
  }
}

// Pad garment onto white 3:4 canvas (contain, don't crop — show full garment)
async function padGarmentTo3x4(buffer) {
  return sharp(buffer)
    .resize(TARGET_W, TARGET_H, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toBuffer()
}
