// pages/collab/explore.js

import DashboardLayout from '../../components/DashboardLayout'
import { useState, useEffect } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ExploreCollab() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    if (!user) return

    async function fetchTasks() {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE_URL}/api/posts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!res.ok) throw new Error('Failed to fetch posts')

        const data = await res.json()
        const othersPosts = data.filter(
          (post) => post.user && post.user._id !== user.id
        )

        const mappedTasks = othersPosts.map((post) => ({
          id: post._id,
          title: post.content.slice(0, 40) || 'Untitled',
          description: post.content,
          owner: post.user.username,
        }))

        setTasks(mappedTasks)
      } catch (err) {
        console.error(err)
        setTasks([])
      }
      setLoading(false)
    }

    fetchTasks()
  }, [user])

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/search?q=${query}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!res.ok) throw new Error('Search failed')

      const users = await res.json()
      setSearchResults(users)
    } catch (err) {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-xl transition-all duration-500">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#7C3AED] mb-6 text-center animate-pulse">
          🚀 Explore Collaboration Tasks
        </h1>

        {/* Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-black"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 w-full sm:w-auto bg-[#7C3AED] text-white rounded-md hover:bg-[#6B21A8] transition font-semibold shadow"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        {searching ? (
          <p className="text-center text-gray-500 mb-6 animate-pulse">Searching...</p>
        ) : searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">🔍 User Results</h2>
            <ul className="space-y-4">
              {searchResults.map((user) => (
                <UserCard key={user._id} user={user} />
              ))}
            </ul>
          </div>
        )}

        {/* Task Section */}
        {loading ? (
          <p className="text-center text-gray-600 animate-pulse">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-600">No collaboration tasks found.</p>
        ) : (
          <ul className="space-y-5">
            {tasks.map(({ id, title, description, owner }) => (
              <li
                key={id}
                className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-xl transition-shadow duration-300 bg-gray-50"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-[#7C3AED]">{title}</h2>
                <p className="text-gray-700 mt-1 text-sm sm:text-base">{description}</p>
                <p className="mt-3 text-sm text-gray-500">
                  Posted by <strong>{owner}</strong>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  )
}

function UserCard({ user }) {
  const [desc, setDesc] = useState('')
  const [projectRole, setProjectRole] = useState('Frontend')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const sendRequest = async () => {
    if (!desc.trim()) return alert('Please enter a short note before sending.')

    setSending(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/collabs/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          toUser: user._id,
          projectRole,
          message: desc,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Request failed')
      }

      setSent(true)
      alert('✅ Collaboration request sent!')
    } catch (err) {
      alert('❌ ' + err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <li className="border p-4 rounded-xl bg-[#F5F3FF] shadow hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-[#7C3AED] font-semibold">{user.username}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <select
            value={projectRole}
            onChange={(e) => setProjectRole(e.target.value)}
            disabled={sending || sent}
            className="px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Fullstack">Fullstack</option>
            <option value="AI/ML">AI/ML</option>
            <option value="DevOps">DevOps</option>
          </select>

          <button
            onClick={sendRequest}
            disabled={sending || sent}
            className={`px-3 py-1 text-sm rounded-md transition font-medium ${
              sent
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-[#7C3AED] hover:bg-[#6B21A8] text-white'
            }`}
          >
            {sent ? 'Request Sent' : sending ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </div>

      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Write a short note..."
        rows={2}
        className="w-full mt-3 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#7C3AED] text-black"
        disabled={sent}
      />
    </li>
  )
}
