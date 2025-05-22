import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Profile() {
  const router = useRouter()
  const { username } = router.query

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!router.isReady || !username) return

    async function fetchProfile() {
      setLoading(true)
      try {
        // Replace this with actual API fetch for profile
        const data = {
          username,
          name: 'John Doe',
          bio: 'Passionate developer and collaborator.',
          postsCount: 5,
          collabCount: 2,
          streak: 7,
        }
        setProfile(data)
      } catch (err) {
        console.error("Failed to fetch profile:", err)
        setProfile(null)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [router.isReady, username])

  if (loading) {
    return <div className="max-w-xl mx-auto p-8 text-center text-gray-600">Loading profile...</div>
  }

  if (!profile) {
    return <div className="max-w-xl mx-auto p-8 text-center text-red-500">Profile not found.</div>
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-8 sm:p-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">{profile.name}</h1>
      <p className="text-gray-700 mb-6">@{profile.username}</p>
      <p className="text-gray-600 mb-6">{profile.bio}</p>

      <div className="flex justify-between text-center text-gray-600 font-semibold border-t border-gray-200 pt-4">
        <div>
          <p className="text-2xl text-blue-600">{profile.postsCount}</p>
          <p>Posts</p>
        </div>
        <div>
          <p className="text-2xl text-blue-600">{profile.collabCount}</p>
          <p>Collaborations</p>
        </div>
        <div>
          <p className="text-2xl text-blue-600">{profile.streak} 🔥</p>
          <p>Streak</p>
        </div>
      </div>
    </div>
  )
}
