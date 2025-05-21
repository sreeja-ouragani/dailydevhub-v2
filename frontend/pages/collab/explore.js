import DashboardLayout from '../../components/DashboardLayout'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ExploreCollab() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true)
      try {
        const data = [
          { id: 1, title: 'Build a landing page', description: 'Design and code a modern landing page', owner: 'alice' },
          { id: 2, title: 'API Integration', description: 'Help integrate third-party APIs', owner: 'bob' },
        ]
        setTasks(data)
      } catch (err) {
        setTasks([])
      }
      setLoading(false)
    }

    fetchTasks()
  }, [])

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">🚀 Explore Collaboration Tasks</h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-600">No collaboration tasks found.</p>
        ) : (
          <ul className="space-y-5">
            {tasks.map(({ id, title, description, owner }) => (
              <li key={id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
                {/* If you want to link to a detailed page: */}
                {/* <Link href={`/collab/task/${id}`} className="block"> */}
                <h2 className="text-xl font-semibold text-blue-600">{title}</h2>
                <p className="text-gray-700 mt-1">{description}</p>
                <p className="mt-3 text-sm text-gray-500">Posted by <strong>{owner}</strong></p>
                {/* </Link> */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  )
}
