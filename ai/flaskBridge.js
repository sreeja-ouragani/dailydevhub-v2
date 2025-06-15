
import { getGPTResponse } from './utils/gptService.js'

// Get the prompt from CLI argument
const prompt = process.argv[2]

if (!prompt) {
  console.error("No prompt passed.")
  process.exit(1)
}

getGPTResponse(prompt)
  .then(response => {
    console.log(response)
  })
  .catch(err => {
    console.error("Gemini Error:", err.message)
    process.exit(1)
  })