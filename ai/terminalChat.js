import readline from 'readline'
import { getGPTResponse } from './utils/gptService.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const faqs = [
  "Suggest a unique JavaScript project idea for my resume",
  "Give me tips to improve my portfolio",
  "Suggest an AI-based final year project",
  "Help me prepare for a web dev interview",
  "Suggest a useful hackathon project"
]

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve))

async function main() {
  console.log("\n🤖 Welcome to Gemini Terminal Chat!")
  console.log("📌 Type your own question or choose from the FAQs below:\n")

  faqs.forEach((faq, index) => {
    console.log(`  ${index + 1}. ${faq}`)
  })

  while (true) {
    console.log("\n💬 Enter your message (or type FAQ number 1–5):")
    const input = await askQuestion("> ")

    let prompt = ""

    if (/^[1-5]$/.test(input.trim())) {
      prompt = faqs[parseInt(input) - 1]
    } else {
      prompt = input.trim()
    }

    if (!prompt) {
      console.log("⚠️  Please enter something valid.")
      continue
    }

    console.log("⏳ Asking Gemini...")
    try {
      const response = await getGPTResponse(prompt)
      console.log("\n✅ Gemini AI Response:\n")
      console.log(response)
    } catch (err) {
      console.error("❌ Gemini Error:", err.message)
    }

    const again = await askQuestion("\n❓ Ask another? (y/n): ")
    if (again.toLowerCase() !== 'y') break
  }

  rl.close()
}

main()
