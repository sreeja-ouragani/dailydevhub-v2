// frontend/utils/aiApi.js
import axios from 'axios';

const AI_API_BASE_URL = process.env.NEXT_PUBLIC_AI_API_BASE_URL || 'http://localhost:8000';

const aiApi = axios.create({
  baseURL: AI_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default aiApi;
