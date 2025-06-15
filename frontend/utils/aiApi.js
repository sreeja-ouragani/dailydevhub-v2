// frontend/utils/aiApi.js
import axios from 'axios'

const AI_API_BASE_URL =
  process.env.NEXT_PUBLIC_AI_API_BASE_URL || 'https://dailydevhub-v2-flask-backend.onrender.com'

const aiApi = axios.create({
  baseURL: AI_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default aiApi
