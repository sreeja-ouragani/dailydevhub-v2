import { getGPTResponse } from '../utils/gptService.js'

export const chatWithAI = async (req, res) => {
  const { message } = req.body

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' })
  }

  try {
    const reply = await getGPTResponse(message)
    res.json({ reply })
  } catch (err) {
    res.status(500).json({ error: 'Gemini AI error occurred.' })
  }
}
