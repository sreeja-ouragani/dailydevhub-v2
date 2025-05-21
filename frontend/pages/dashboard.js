import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from '../components/DashboardLayout'

function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-tr from-white to-blue-100 px-4 py-24 sm:py-12">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 text-center w-full max-w-md sm:max-w-lg">
        {user ? (
          <h1 className="text-2xl sm:text-4xl font-bold text-blue-700 font-sans">
            Welcome, {user.username}! 🎉
          </h1>
        ) : (
          <p className="text-base sm:text-lg text-gray-600">Loading...</p>
        )}
      </div>

      {user && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full px-2 sm:px-0 max-w-5xl">
          <div className="bg-white shadow-md p-5 sm:p-6 rounded-xl">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-600">Your Posts</h2>
            <p className="text-sm sm:text-base text-gray-500">No posts yet.</p>
          </div>
          <div className="bg-white shadow-md p-5 sm:p-6 rounded-xl">
            <h2 className="text-lg sm:text-xl font-semibold text-blue-600">Streak Tracker</h2>
            <p className="text-sm sm:text-base text-gray-500">Start your coding streak!</p>
          </div>
        </div>
      )}
    </div>
  )
}

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Dashboard
