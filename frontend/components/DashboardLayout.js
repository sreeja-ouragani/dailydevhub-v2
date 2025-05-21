import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Attempt to retrieve user data from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      // If user data exists, parse it and set the user state
      setUser(JSON.parse(userData))
    } else {
      // If no user data, redirect to the login page
      router.push('/login')
    }
  }, [router]) // Depend on router to ensure effect runs when router is ready

  // Define navigation links for the sidebar
  const navLinks = [
    { label: '🏠 Dashboard', href: '/dashboard' },
    { label: '📝 Create Post', href: '/create-post' },
    { label: '🚀 Explore Collab', href: '/collab/explore' },
    { label: '📨 Collab Requests', href: '/collab/requests' },
    { label: '💡 AI Project Idea Generator', href: '/ai/project-ideas' },
    // Removed the '📈 View Streak' link as per the request
    { label: '👤 Profile', href: user ? `/profile/${user.username}` : '/profile' },
  ]

  // Handle user logout
  const handleLogout = () => {
    // Remove authentication token and user data from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Redirect to the login page
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Topbar - visible only on small screens */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md px-4 py-3 flex justify-between items-center sm:hidden z-30">
        <h2 className="text-lg font-bold text-blue-700 font-serif">DailyDevHub</h2>
        <button
          aria-label="Toggle Sidebar"
          onClick={() => setSidebarOpen(!sidebarOpen)} // Toggle sidebar visibility
          className="text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          {/* Icon for toggling sidebar (close/open) */}
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

      {/* Sidebar - responsive visibility and positioning */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-md px-6 py-6 flex flex-col w-64 z-40 transition-transform duration-300 ease-in-out overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0 sm:static sm:z-auto sm:pt-6 pt-20`} // Adjust padding for mobile topbar
      >
        {/* DailyDevHub logo for desktop */}
        <h2 className="text-2xl font-bold mb-8 text-blue-700 font-serif hidden sm:block">DailyDevHub</h2>

        {/* Navigation links */}
        <nav className="flex flex-col space-y-3">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`block px-4 py-2 rounded-lg font-medium hover:bg-blue-100 ${
                router.pathname === href ? 'bg-blue-200 text-blue-800' : 'text-gray-700'
              }`}
              onClick={() => setSidebarOpen(false)} // Close sidebar on link click (for mobile)
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* User profile and logout section */}
        <div className="mt-auto pt-6 border-t border-gray-200">
          {user && ( // Only show if user is logged in
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 sm:ml-64 pt-24 sm:pt-8 bg-gradient-to-tr from-white to-blue-50">
        {children} {/* Renders the child components passed to the layout */}
      </main>
    </div>
  )
}
