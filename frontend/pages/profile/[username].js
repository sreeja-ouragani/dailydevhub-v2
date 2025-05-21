import { useState, useEffect } from 'react'

export default function Profile() {
  // Removed useRouter as it's a Next.js specific hook and causing the compilation error.
  // We'll simulate the username for demonstration purposes.
  // In a real non-Next.js app, this 'username' might come from props, context, or a different routing solution.
  const [username, setUsername] = useState('johndoe'); // Hardcoded a default username for compilation.
  // State to hold the profile data
  const [profile, setProfile] = useState(null)
  // State to manage the loading status
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // The router.isReady check is removed as useRouter is no longer used.
    // The fetchProfile function will now run directly when the component mounts
    // or if the 'username' state (if it were dynamic) changes.

    async function fetchProfile() {
      setLoading(true) // Set loading to true while fetching
      try {
        // Replace with actual API call to fetch user profile data
        // For now, using mock data based on the hardcoded 'username'
        const data = {
          username: username, // Use the username state
          name: 'John Doe', // Example name
          bio: 'Passionate developer and collaborator.', // Example bio
          postsCount: 5, // Example posts count
          collabCount: 2, // Example collaborations count
          streak: 7, // Added a mock streak value
        }
        setProfile(data) // Set the fetched profile data
      } catch (err) {
        // Log any errors and set profile to null if fetching fails
        console.error("Failed to fetch profile:", err);
        setProfile(null)
      }
      setLoading(false) // Set loading to false after fetching (success or failure)
    }

    fetchProfile() // Call the fetch function
  }, [username]) // Depend on username. Since it's hardcoded, this effect runs once on mount.

  // Display a loading message while data is being fetched
  if (loading) {
    return <div className="max-w-xl mx-auto p-8 text-center text-gray-600">Loading profile...</div>
  }

  // Display a "not found" message if profile data is null after loading
  if (!profile) {
    return <div className="max-w-xl mx-auto p-8 text-center text-red-500">Profile not found.</div>
  }

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-8 sm:p-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">{profile.name}</h1>
      <p className="text-gray-700 mb-6">@{profile.username}</p>
      <p className="text-gray-600 mb-6">{profile.bio}</p>

      <div className="flex justify-between text-center text-gray-600 font-semibold border-t border-gray-200 pt-4">
        {/* Display Posts Count */}
        <div>
          <p className="text-2xl text-blue-600">{profile.postsCount}</p>
          <p>Posts</p>
        </div>
        {/* Display Collaborations Count */}
        <div>
          <p className="text-2xl text-blue-600">{profile.collabCount}</p>
          <p>Collaborations</p>
        </div>
        {/* Display View Streak */}
        <div>
          <p className="text-2xl text-blue-600">{profile.streak} 🔥</p> {/* Added streak with an emoji */}
          <p>Streak</p>
        </div>
      </div>
    </div>
  )
}
