import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import DashboardLayout from '../components/DashboardLayout'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [error, setError] = useState('')
  const [streak, setStreak] = useState(null)
  const [loadingStreak, setLoadingStreak] = useState(false)
  const [streakError, setStreakError] = useState('')
  const [quote, setQuote] = useState('')

  const motivationalQuotes = [
    "Stay consistent. Small steps every day lead to big results.",
    "Discipline is the bridge between goals and accomplishment.",
    "You're not always going to be motivated. You must learn to be disciplined.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Push yourself, because no one else is going to do it for you.",
    "The secret to your future is hidden in your daily routine.",
    "Keep the streak alive. Your future self will thank you.",
    "Don’t limit your challenges. Challenge your limits.",
    "Motivation gets you going, but discipline keeps you growing."
  ]

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/login')
    } else {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }

    const random = Math.floor(Math.random() * motivationalQuotes.length)
    setQuote(motivationalQuotes[random])
  }, [router])

  useEffect(() => {
    if (!user) return

    const fetchPosts = async () => {
      setLoadingPosts(true)
      setError('')

      try {
        const res = await fetch(`${API_BASE_URL}/posts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!res.ok) throw new Error('Failed to fetch posts')

        const data = await res.json()

        const userPosts = data.filter(
          (post) => post.user && String(post.user._id) === String(user.id)
        )
        setPosts(userPosts)

        const today = new Date().toDateString()
        const hasPostedToday = userPosts.some((post) => {
          const postDate = new Date(post.createdAt).toDateString()
          return postDate === today
        })

        if (hasPostedToday) {
          await fetch(`${API_BASE_URL}/streak/update`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingPosts(false)
      }
    }

    fetchPosts()
  }, [user])

  useEffect(() => {
    if (!user) return

    const fetchStreak = async () => {
      setLoadingStreak(true)
      setStreakError('')
      try {
        const res = await fetch(`${API_BASE_URL}/streak`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (!res.ok) throw new Error('Failed to fetch streak')
        const data = await res.json()
        setStreak(data)
      } catch (err) {
        setStreakError('noStreak')
      } finally {
        setLoadingStreak(false)
      }
    }

    fetchStreak()
  }, [user])

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white px-4 py-24 sm:py-12">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-10 text-center w-full max-w-md sm:max-w-lg">
        {user ? (
          <h1 className="text-2xl sm:text-4xl font-bold text-[#7C3AED] font-sans">
            Welcome, {user.username}! 🎉
          </h1>
        ) : (
          <p className="text-base sm:text-lg text-gray-600">Loading...</p>
        )}
      </div>

      {user && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full px-2 sm:px-0 max-w-5xl">
          <div className="bg-white shadow-md p-5 sm:p-6 rounded-xl">
            <h2 className="text-lg sm:text-xl font-semibold text-[#6B21A8]">Your Posts</h2>

            {loadingPosts ? (
              <p className="text-gray-500">Loading posts...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : posts.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-500">No posts yet.</p>
            ) : (
              <ul className="space-y-4 max-h-64 overflow-y-auto">
                {posts.map(post => (
                  <li
                    key={post._id}
                    className="border border-[#7C3AED] p-3 rounded-md shadow-sm shine-border"
                  >
                    <p className="font-semibold text-gray-800 break-words whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {post.mediaUrl && post.mediaUrl.startsWith('http') && (
                      post.mediaUrl.endsWith('.mp4') || post.mediaUrl.includes('video') ? (
                        <video controls className="w-full max-h-64 mt-3 rounded">
                          <source src={post.mediaUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={post.mediaUrl}
                          alt="Post media"
                          className="mt-3 max-h-48 w-full object-cover rounded"
                        />
                      )
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      Posted on {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white shadow-md p-5 sm:p-6 rounded-xl relative">
            <h2 className="text-lg sm:text-xl font-semibold text-[#6B21A8]">Streak Tracker</h2>

            {loadingStreak ? (
              <p className="text-gray-500">Loading streak...</p>
            ) : streakError === 'noStreak' ? (
              <p className="text-[#7C3AED] italic text-center text-base sm:text-lg">
                🔥 You haven't started your streak yet! <br />
                Start posting daily to ignite your streak and keep the momentum going! 💪✨
              </p>
            ) : streakError ? (
              <p className="text-red-500">{streakError}</p>
            ) : streak ? (
              <>
                <p className="text-xl font-bold text-[#7C3AED]">
                  Current Streak: {streak.currentStreak} {streak.currentStreak === 1 ? 'day' : 'days'}
                </p>
                <p className="text-sm text-gray-600">
                  Longest Streak: {streak.longestStreak} {streak.longestStreak === 1 ? 'day' : 'days'}
                </p>

                <div className="mt-5 text-sm sm:text-base text-gray-700 bg-[#DDD6FE] border-l-4 border-[#C4B5FD] p-3 rounded animate-fade-in">
                  <span className="italic">“{quote}”</span>
                </div>
              </>
            ) : (
              <p className="text-sm sm:text-base text-gray-500">Start your coding streak!</p>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out, pulseGlow 3s infinite ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 0px rgba(124, 58, 237, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(124, 58, 237, 0.6);
          }
          100% {
            box-shadow: 0 0 0px rgba(124, 58, 237, 0.3);
          }
        }

        .shine-border {
          animation: glowBorder 2s infinite ease-in-out;
        }

        @keyframes glowBorder {
          0% {
            box-shadow: 0 0 0px rgba(124, 58, 237, 0.3);
          }
          50% {
            box-shadow: 0 0 10px rgba(124, 58, 237, 0.7);
          }
          100% {
            box-shadow: 0 0 0px rgba(124, 58, 237, 0.3);
          }
        }
      `}</style>
    </div>
  )
}

Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export default Dashboard
