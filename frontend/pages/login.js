// pages/login.js
import Link from 'next/link'
import { useState } from 'react'
import api from '../utils/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })

      const token = res.data?.token
      const user = res.data?.user

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      alert('Logged in successfully! ✅')
      window.location.href = '/dashboard'
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-white to-[#DDD6FE] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-10 animate-fade-in-up">
        <h1 className="text-4xl font-serif font-bold text-[#7C3AED] text-center mb-6 sm:mb-8 tracking-tight">
          DailyDevHub
        </h1>

        <h2 className="text-lg sm:text-2xl font-semibold text-[#1F2937] mb-8 text-center">
          Welcome Back! Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-[#1F2937] font-medium mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#DDD6FE] transition text-[#1F2937] bg-[#F9F9FF]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[#1F2937] font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-[#DDD6FE] transition text-[#1F2937] bg-[#F9F9FF]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7C3AED] hover:bg-[#6B21A8] text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-[#1F2937] text-sm">
          New here?{' '}
          <Link href="/signup" className="text-[#7C3AED] font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
