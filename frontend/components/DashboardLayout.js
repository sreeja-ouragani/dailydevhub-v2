// DashboardLayout.js
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push('/login')
    }
  }, [router])

  // 🚫 Removed the '👤 Profile' link
  const navLinks = [
    { label: '🏠 Dashboard', href: '/dashboard' },
    { label: '📝 Create Post', href: '/create-post' },
    { label: '🚀 Explore Collab', href: '/collab/explore' },
    { label: '📨 Collab Requests', href: '/collab/requests' },
    { label: '🤖 DevBot Chat', href: '/chat' },
    // { label: '👤 Profile', href: user ? `/profile/${user.username}` : '/profile' }, ← REMOVED
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 flex justify-between items-center sm:hidden z-30">
        <h2 className="text-lg font-bold text-blue-700 font-serif">DailyDevHub</h2>
        <button
          aria-label="Toggle Sidebar"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          {sidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-md px-6 py-6 flex flex-col w-64 z-40 transition-transform duration-300 ease-in-out overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0 sm:static sm:z-auto sm:pt-6 pt-20`}
      >
        <h2 className="text-2xl font-bold mb-8 text-blue-700 font-serif hidden sm:block">DailyDevHub</h2>

        <nav className="flex flex-col space-y-3">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`block px-4 py-2 rounded-lg font-medium hover:bg-blue-100 ${
                router.pathname === href ? 'bg-blue-200 text-blue-800' : 'text-gray-700'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200">
          {user && (
            <div className="text-sm text-gray-600">
              <p className="font-semibold">{user.name}</p>
              <button
                onClick={handleLogout}
                className="mt-2 text-red-500 hover:underline text-sm"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 sm:ml-64 pt-24 sm:pt-8 bg-gradient-to-tr from-white to-blue-50">
        {children}
      </main>
    </div>
  )
}
