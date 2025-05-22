import DashboardLayout from '../../components/DashboardLayout'
import { useState, useEffect } from 'react'

export default function CollabRequests() {
  const [activeTab, setActiveTab] = useState('received')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  const [currentUserId, setCurrentUserId] = useState(null)

  // Load token and user ID from localStorage on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user'))
      setToken(storedToken || '')
      setCurrentUserId(user?._id || null)
    }
  }, [])

  // Fetch collaboration requests based on active tab
  useEffect(() => {
    if (!token) return // Wait until token is available

    async function fetchRequests() {
      setLoading(true)
      setError('')
      try {
        let endpoint = ''
        if (activeTab === 'received') endpoint = '/received'
        else if (activeTab === 'sent') endpoint = '/sent'
        else if (activeTab === 'ongoing') endpoint = '/ongoing'

        const res = await fetch(`http://localhost:5000/api/collabs${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('Failed to fetch requests')
        const data = await res.json()
        setRequests(data)
      } catch (err) {
        setError(err.message || 'Something went wrong')
        setRequests([])
      }
      setLoading(false)
    }

    fetchRequests()
  }, [activeTab, token])

  // Accept/Reject handler for received requests
  const handleRespond = async (id, action) => {
    setError('')
    try {
      const res = await fetch(`http://localhost:5000/api/collabs/${id}/respond`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Failed to update request')
      }

      const updatedRequest = await res.json()
      setRequests((prev) =>
        prev.map((req) => (req._id === updatedRequest._id ? updatedRequest : req))
      )
    } catch (err) {
      setError(err.message || 'Something went wrong')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">🤝 Collaborations</h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          {['received', 'sent', 'ongoing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tab === 'received' && '📨 Received'}
              {tab === 'sent' && '📤 Sent'}
              {tab === 'ongoing' && '✅ Ongoing'}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-600">No {activeTab} requests.</p>
        ) : (
          <ul className="space-y-5">
            {requests.map((req) => {
              const user =
                activeTab === 'received'
                  ? req.fromUser
                  : activeTab === 'sent'
                  ? req.toUser
                  : req.fromUser._id === currentUserId
                  ? req.toUser
                  : req.fromUser

              return (
                <li
                  key={req._id}
                  className="border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-blue-600">{user?.username} is involved as:</p>
                    <p className="text-gray-700">{req.projectRole}</p>
                    {req.message && <p className="text-gray-600 italic mt-1">"{req.message}"</p>}
                    <p className="mt-1 text-sm text-gray-500">
                      Status: {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </p>
                  </div>

                  {/* Show Accept/Reject only for received + pending */}
                  {activeTab === 'received' && req.status === 'pending' && (
                    <div className="mt-4 sm:mt-0 space-x-3">
                      <button
                        onClick={() => handleRespond(req._id, 'accepted')}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(req._id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </DashboardLayout>
  )
}
