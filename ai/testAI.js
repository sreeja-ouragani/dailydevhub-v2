import { getGPTResponse } from './utils/gptService.js'

const test = async () => {
  const response = await getGPTResponse("Suggest a unique JavaScript project idea for my resume")
  console.log("✅ Gemini AI Response:\n", response)
}

test().catch(err => console.error("❌ Error testing Gemini:", err.message))
