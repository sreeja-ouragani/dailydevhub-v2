import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'

const ChatPage = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const faqs = [
    "Suggest a unique JavaScript project idea for my resume",
    "Give me tips to improve my portfolio",
    "Suggest an AI-based final year project",
    "Help me prepare for a web dev interview",
    "Suggest a useful hackathon project"
  ]

  const handleFAQClick = (faq) => {
    setMessages((prev) => [...prev, { role: 'user', content: faq }])
    setMessages((prev) => [...prev, { role: 'bot', content: '⏳ Generating AI response...' }])
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setMessages((prev) => [...prev, { role: 'user', content: input }])
    setMessages((prev) => [...prev, { role: 'bot', content: '⏳ Generating AI response...' }])
    setInput('')
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full min-h-[80vh] max-w-5xl mx-auto bg-white rounded-xl overflow-hidden shadow-2xl shadow-gray-400">
      {/* Chat window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            🤖 Ask something or tap a FAQ below to get started.
          </p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-lg px-4 py-3 rounded-xl shadow-md ${
                msg.role === 'user'
                  ? 'ml-auto bg-blue-100 text-right text-blue-900'
                  : 'mr-auto bg-white text-left text-gray-700 border border-gray-200'
              }`}
            >
              {msg.content}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Auto-scrolling FAQ carousel */}
      <div className="relative overflow-hidden border-t bg-blue-50 py-3 shadow-inner">
        <div className="animate-scroll flex gap-4 w-max px-4">
          {[...faqs, ...faqs].map((faq, index) => (
            <button
              key={index}
              onClick={() => handleFAQClick(faq)}
              className="bg-blue-600 text-white text-xs sm:text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition whitespace-nowrap shadow"
            >
              {faq}
            </button>
          ))}
        </div>
      </div>

      {/* Chat input */}
      <form onSubmit={handleSend} className="flex items-center p-3 border-t bg-white">
        <input
          type="text"
          className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="ml-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow"
        >
          Send
        </button>
      </form>

      {/* Styles for animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  )
}

ChatPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default ChatPage
