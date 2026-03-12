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

// In production, serve the React frontend
const clientDist = path.join(__dirname, '..', 'client', 'dist')
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist))
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`TryOn AI server running on http://localhost:${PORT}`)
  const hasToken = process.env.REPLICATE_API_TOKEN && process.env.REPLICATE_API_TOKEN !== 'your_token_here'
  console.log(`Replicate API: ${hasToken ? 'configured' : 'NOT configured — set REPLICATE_API_TOKEN in .env'}`)
})
