// ai/server.js

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import chatRoutes from './routes/chatRoutes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Base route to check server status
app.get('/', (req, res) => {
  res.send('🤖 Gemini AI API is running!')
})

// Main AI route
app.use('/api/ai', chatRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ AI Server running on port ${PORT}`)
})
