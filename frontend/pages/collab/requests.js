import DashboardLayout from '../../components/DashboardLayout'
import { useState, useEffect } from 'react'

export default function CollabRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch collaboration requests from backend API
  useEffect(() => {
    async function fetchRequests() {
      setLoading(true)
      setError('')
      try {
        // NOTE: Use `/api/collabs/received` (with 's') to match backend route
        const res = await fetch('http://localhost:5000/api/collabs/received', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!res.ok) {
          throw new Error('Failed to fetch collaboration requests')
        }

        const data = await res.json()
        setRequests(data)
      } catch (err) {
        setError(err.message || 'Something went wrong')
        setRequests([])
      }
      setLoading(false)
    }

    fetchRequests()
  }, [])

  // Respond to a collaboration request (accept/reject)
  const handleRespond = async (id, action) => {
    setError('')
    try {
      // NOTE: Use `/api/collabs/${id}/respond` (with 's') to match backend route
      const res = await fetch(`http://localhost:5000/api/collabs/${id}/respond`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: action }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Failed to update request')
      }

      const updatedRequest = await res.json()

      // Update the request status locally after response
      setRequests((prev) =>
        prev.map((req) => (req._id === updatedRequest._id ? updatedRequest : req))
      )
    } catch (err) {
      setError(err.message || 'Something went wrong')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">📨 Collaboration Requests</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading requests...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-600">No collaboration requests.</p>
        ) : (
          <ul className="space-y-5">
            {requests.map(({ _id, fromUser, projectRole, message, status }) => (
              <li
                key={_id}
                className="border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <p className="font-semibold text-blue-600">{fromUser.username} wants to collaborate as:</p>
                  <p className="text-gray-700">{projectRole}</p>
                  {message && <p className="text-gray-600 italic mt-1">"{message}"</p>}
                  <p className="mt-1 text-sm text-gray-500">
                    Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                  </p>
                </div>

                {status === 'pending' && (
                  <div className="mt-4 sm:mt-0 space-x-3">
                    <button
                      onClick={() => handleRespond(_id, 'accepted')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(_id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  )
}
