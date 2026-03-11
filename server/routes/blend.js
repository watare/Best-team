import express from 'express'
import multer from 'multer'
import { swapFaces } from '../services/faceSwap.js'

const router = express.Router()

// Use memory storage — no files written to disk for uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// POST /api/blend
// Fields: source (face to swap in), target (background/body image)
router.post(
  '/',
  upload.fields([
    { name: 'source', maxCount: 1 },
    { name: 'target', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const files = req.files

      if (!files || !files.source || !files.target) {
        return res.status(400).json({
          error: 'Both "source" and "target" image fields are required.'
        })
      }

      const sourceBuffer = files.source[0].buffer
      const targetBuffer = files.target[0].buffer

      const resultBuffer = await swapFaces(sourceBuffer, targetBuffer)

      res.set('Content-Type', 'image/jpeg')
      res.set('Content-Length', resultBuffer.length)
      res.status(200).send(resultBuffer)
    } catch (err) {
      console.error('Face swap error:', err)
      res.status(500).json({
        error: 'Face swap failed.',
        details: err.message
      })
    }
  }
)

export default router
