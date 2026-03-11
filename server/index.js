import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import blendRouter from './routes/blend.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure required directories exist
const uploadsDir = path.join(__dirname, 'uploads')
const outputsDir = path.join(__dirname, 'outputs')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true })
}

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Serve output files statically
app.use('/outputs', express.static(outputsDir))

// Mount blend route
app.use('/api/blend', blendRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`FaceBlend server running on http://localhost:${PORT}`)
  console.log(`Replicate API: ${process.env.REPLICATE_API_TOKEN && process.env.REPLICATE_API_TOKEN !== 'your_token_here' ? 'configured' : 'not configured (using fallback)'}`)
})
