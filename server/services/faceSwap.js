// faceSwap.js
// Tries Replicate API first, falls back to sharp blend

import Replicate from 'replicate'
import sharp from 'sharp'
import fetch from 'node-fetch'

export async function swapFaces(sourceBuffer, targetBuffer) {
  const token = process.env.REPLICATE_API_TOKEN

  if (token && token !== 'your_token_here') {
    try {
      return await swapWithReplicate(sourceBuffer, targetBuffer, token)
    } catch (err) {
      console.warn('Replicate failed, using fallback:', err.message)
    }
  }

  return await blendFallback(sourceBuffer, targetBuffer)
}

async function swapWithReplicate(sourceBuffer, targetBuffer, token) {
  const replicate = new Replicate({ auth: token })

  // Convert buffers to base64 data URIs
  const sourceB64 = `data:image/jpeg;base64,${sourceBuffer.toString('base64')}`
  const targetB64 = `data:image/jpeg;base64,${targetBuffer.toString('base64')}`

  const output = await replicate.run(
    'cdingram/face-swap:d1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111',
    {
      input: {
        swap_image: sourceB64,
        target_image: targetB64
      }
    }
  )

  // output is a URL — fetch the resulting image
  const response = await fetch(output)
  if (!response.ok) {
    throw new Error(`Failed to fetch Replicate output: ${response.status} ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

async function blendFallback(sourceBuffer, targetBuffer) {
  // Get metadata of target to determine output dimensions
  const targetMeta = await sharp(targetBuffer).metadata()
  const width = targetMeta.width
  const height = targetMeta.height

  // Resize source to match target dimensions
  const resizedSource = await sharp(sourceBuffer)
    .resize(width, height, { fit: 'cover' })
    .toBuffer()

  // Blend: composite source at 50% opacity over target using multiply blend
  const result = await sharp(targetBuffer)
    .composite([
      {
        input: resizedSource,
        blend: 'multiply',
        opacity: 0.5
      }
    ])
    .jpeg({ quality: 90 })
    .toBuffer()

  return result
}
