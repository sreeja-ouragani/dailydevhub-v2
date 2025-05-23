import DashboardLayout from '../../components/DashboardLayout'
import { useState, useEffect } from 'react'

export default function ExploreCollab() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  // 1. Get current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // 2. Fetch real posts from API and exclude current user's posts
  useEffect(() => {
    if (!user) return

    async function fetchTasks() {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:5000/api/posts', {
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
      const res = await fetch(`http://localhost:5000/api/users/search?q=${query}`, {
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
      <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">🚀 Explore Collaboration Tasks</h1>

        {/* Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        {searching ? (
          <p className="text-center text-gray-500 mb-6">Searching...</p>
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
          <p className="text-center text-gray-600">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-600">No collaboration tasks found.</p>
        ) : (
          <ul className="space-y-5">
            {tasks.map(({ id, title, description, owner }) => (
              <li key={id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold text-blue-600">{title}</h2>
                <p className="text-gray-700 mt-1">{description}</p>
                <p className="mt-3 text-sm text-gray-500">Posted by <strong>{owner}</strong></p>
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
      const res = await fetch('http://localhost:5000/api/collabs/', {
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
    <li className="border p-4 rounded-lg bg-gray-50 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-blue-700 font-semibold">{user.username}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <select
          value={projectRole}
          onChange={(e) => setProjectRole(e.target.value)}
          disabled={sending || sent}
          className="mr-3 px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
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
          className={`px-3 py-1 text-sm rounded-md ${
            sent
              ? 'bg-green-500 text-white cursor-default'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {sent ? 'Request Sent' : sending ? 'Sending...' : 'Send Request'}
        </button>
      </div>

      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Write a short note..."
        rows={2}
        className="w-full mt-3 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 text-black"
        disabled={sent}
      />
    </li>
  )
}
