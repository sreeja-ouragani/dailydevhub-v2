import Link from 'next/link'
import { useState } from 'react'
import api from '../utils/api'

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    const errs = {}
    if (!formData.username.trim()) errs.username = 'Username is required'
    if (!formData.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Email is invalid'
    if (!formData.password) errs.password = 'Password is required'
    else if (formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const res = await api.post('/auth/signup', formData)
      alert('Account created! 🎉')
      // Optional: redirect to login page
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message || 'Signup failed. Try again.'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="md:w-1/2 bg-gradient-to-tr from-blue-600 to-purple-700 text-white flex flex-col justify-center items-center p-10 md:p-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-wide text-center">
          DailyDevHub
        </h1>
        <p className="text-base md:text-lg max-w-md text-center opacity-90 leading-relaxed">
          Join our community of passionate developers. Share your progress, collaborate on projects, and keep your developer streak alive!
        </p>
        <div className="mt-10 md:mt-12 text-center opacity-80">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto w-20 h-20 md:w-24 md:h-24 animate-bounce text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="mt-2 font-semibold italic text-sm md:text-base">Ready to get started?</p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="md:w-1/2 bg-white flex items-center justify-center p-8 md:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8" noValidate>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
            Create your account
          </h2>

          {/* Username */}
          <div className="relative">
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder=" "
              className={`peer block w-full appearance-none border-b-2 bg-transparent px-0 pb-1 pt-6 text-gray-900 focus:outline-none focus:ring-0 ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:border-blue-600`}
              autoComplete="username"
            />
            <label
              htmlFor="username"
              className="absolute left-0 top-2 text-gray-500 text-sm transition-all
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
            >
              Username
            </label>
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              className={`peer block w-full appearance-none border-b-2 bg-transparent px-0 pb-1 pt-6 text-gray-900 focus:outline-none focus:ring-0 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-blue-600`}
              autoComplete="email"
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-2 text-gray-500 text-sm transition-all
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
            >
              Email address
            </label>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              className={`peer block w-full appearance-none border-b-2 bg-transparent px-0 pb-1 pt-6 text-gray-900 focus:outline-none focus:ring-0 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-blue-600`}
              autoComplete="new-password"
            />
            <label
              htmlFor="password"
              className="absolute left-0 top-2 text-gray-500 text-sm transition-all
                peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
            >
              Password
            </label>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white font-bold rounded-md hover:from-purple-700 hover:to-blue-600 transition"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
