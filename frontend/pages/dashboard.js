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
    <div className="flex flex-col items-center justify-center min-h-full bg-gradient-to-tr from-white to-blue-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center w-full max-w-lg">
        {user ? (
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 font-serif">
            Welcome, {user.name}! 🎉
          </h1>
        ) : (
          <p className="text-lg text-gray-600">Loading...</p>
        )}
      </div>
    </div>
  )
}

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Dashboard
