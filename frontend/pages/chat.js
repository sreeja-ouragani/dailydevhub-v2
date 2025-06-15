import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import aiApi from '../utils/aiApi'

const ChatPage = () => {
  const [messages, setMessages] = useState([])
  const [input,    setInput]    = useState('')
  const endRef                  = useRef(null)

  const faqs = [
    'Suggest a unique JavaScript project idea for my resume',
    'Give me tips to improve my portfolio',
    'Suggest an AI-based final year project',
    'Help me prepare for a web dev interview',
    'Suggest a useful hackathon project',
  ]

  /* ---------------------------- AI Call Helper --------------------------- */
  const sendToAI = async (msg) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'))
      const username = currentUser?.username

      if (!username) {
        setMessages(prev => [...prev.slice(0, -1), { role: 'bot', content: '⚠️ Please log in to use the chatbot.' }])
        return
      }

      const { data } = await aiApi.post('/api/ai/chat', {
        message: msg,
        username: username
      })

      setMessages(prev => [...prev.slice(0, -1), { role: 'bot', content: data.reply || '⚠️ No reply.' }])
    } catch {
      setMessages(prev => [...prev.slice(0, -1), { role: 'bot', content: '❌ Error contacting AI.' }])
    }
  }

  /* ------------------------------ Handlers ------------------------------- */
  const pushUser = (text) => {
    setMessages(p => [...p, { role: 'user', content: text }, { role: 'bot', content: '⏳ Generating…' }])
    sendToAI(text)
  }

  const onSend = (e) => {
    e.preventDefault()
    if (input.trim()) {
      pushUser(input)
      setInput('')
    }
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /* ---------------------------------------------------------------------- */
  return (
    <div className="flex flex-col max-w-5xl mx-auto h-[90vh] sm:h-[85vh] bg-white rounded-xl overflow-hidden shadow-2xl shadow-purple-300 border border-gray-200">
      {/* Header */}
      <div className="bg-[#7C3AED] text-white text-center py-3 text-lg sm:text-xl font-semibold shadow-md">
        💬 AI Chat Assistant
      </div>

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F5FF]">
        {messages.length === 0 ? (
          <div className="mt-10 text-center text-[#7C3AED] text-sm sm:text-base border border-purple-300 rounded-lg px-4 py-3 bg-white shadow animate-pulse">
            🤖 <span className="font-medium">Ask something or tap a FAQ below to get started.</span>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-lg px-4 py-3 rounded-xl shadow-md animate-fade-in ${
                m.role === 'user'
                  ? 'ml-auto bg-[#DDD6FE] text-right text-[#4C1D95]'
                  : 'mr-auto bg-white text-left text-gray-700 border border-purple-200'
              }`}
            >
              {m.role === 'bot'
                ? <div className="prose prose-sm sm:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: m.content }} />
                : m.content}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {/* FAQ carousel */}
      <div className="relative overflow-hidden border-t bg-[#F3E8FF] py-3 shadow-inner">
        <div className="animate-scroll flex gap-4 w-max px-4">
          {[...faqs, ...faqs].map((faq, idx) => (
            <button
              key={idx}
              onClick={() => pushUser(faq)}
              className="bg-[#7C3AED] text-white text-xs sm:text-sm px-4 py-2 rounded-full hover:bg-[#6B21A8] transition whitespace-nowrap shadow"
            >
              {faq}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={onSend} className="flex items-center p-3 border-t bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 sm:p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] shadow-sm text-sm sm:text-base"
          placeholder="Type your question…"
        />
        <button type="submit" className="ml-3 bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6B21A8] transition shadow">
          Send
        </button>
      </form>

      {/* Animations */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0%) }
          100% { transform: translateX(-50%) }
        }
        .animate-scroll { animation: scroll 20s linear infinite }
        @keyframes fade-in {
          from { opacity:0; transform:translateY(10px) }
          to   { opacity:1; transform:translateY(0) }
        }
        .animate-fade-in { animation: fade-in .3s ease-in-out }
      `}</style>
    </div>
  )
}

ChatPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>
export default ChatPage
