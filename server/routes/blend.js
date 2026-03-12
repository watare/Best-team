import express from 'express'
import multer from 'multer'
import { tryOnClothes } from '../services/faceSwap.js'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// POST /api/blend
router.post(
  '/',
  upload.fields([
    { name: 'person', maxCount: 1 },
    { name: 'garment', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const files = req.files

      if (!files || !files.person || !files.garment) {
        return res.status(400).json({
          error: 'Both "person" and "garment" image fields are required.'
        })
      }

      const personBuffer = files.person[0].buffer
      const garmentBuffer = files.garment[0].buffer
      const category = req.body.category || 'upper_body'
      const garmentDesc = req.body.garmentDesc || 'clothing item'

      const resultBuffer = await tryOnClothes(personBuffer, garmentBuffer, category, garmentDesc)

      res.set('Content-Type', 'image/jpeg')
      res.set('Content-Length', resultBuffer.length)
      res.status(200).send(resultBuffer)
    } catch (err) {
      console.error('Try-on error:', err)
      res.status(500).json({
        error: 'Virtual try-on failed.',
        details: err.message
      })
    }
  }
)

export default router
