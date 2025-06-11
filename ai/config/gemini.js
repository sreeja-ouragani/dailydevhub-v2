import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

import { GoogleGenerativeAI } from '@google/generative-ai'

// Use v1 and correct model name
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export default genAI
