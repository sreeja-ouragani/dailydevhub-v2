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

      // Store token and user in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      alert('Logged in successfully! ✅')

      // Redirect to dashboard after login
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-blue-50 to-white items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <h1 className="text-4xl font-serif font-bold text-blue-700 text-center mb-8 tracking-tight">
          DailyDevHub
        </h1>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-8 text-center">
          Welcome Back! Login to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition text-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          New here?{' '}
          <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
