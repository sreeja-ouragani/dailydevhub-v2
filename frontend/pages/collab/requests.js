import DashboardLayout from '../../components/DashboardLayout'
import { useState, useEffect } from 'react'

export default function CollabRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true)
      try {
        const data = [
          { id: 1, from: 'charlie', task: 'Landing page design', status: 'Pending' },
          { id: 2, from: 'diana', task: 'Backend API help', status: 'Accepted' },
        ]
        setRequests(data)
      } catch (err) {
        setRequests([])
      }
      setLoading(false)
    }
    fetchRequests()
  }, [])

  const handleRespond = (id, action) => {
    alert(`You ${action} request #${id}`)
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">📨 Collaboration Requests</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-600">No collaboration requests.</p>
        ) : (
          <ul className="space-y-5">
            {requests.map(({ id, from, task, status }) => (
              <li
                key={id}
                className="border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <p className="font-semibold text-blue-600">{from} wants to collaborate on:</p>
                  <p className="text-gray-700">{task}</p>
                  <p className="mt-1 text-sm text-gray-500">Status: {status}</p>
                </div>

                {status === 'Pending' && (
                  <div className="mt-4 sm:mt-0 space-x-3">
                    <button
                      onClick={() => handleRespond(id, 'accepted')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespond(id, 'rejected')}
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
