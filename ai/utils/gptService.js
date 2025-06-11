import genAI from '../config/gemini.js'

export async function getGPTResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' })  // ✅ Use correct full model name

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text
  } catch (err) {
    console.error('❌ Gemini API Error:', err)
    throw err
  }
}
