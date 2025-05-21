import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null) // for image/video
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [token, setToken] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      router.push('/login')
    } else {
      setToken(storedToken)
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description) {
      setMessage('Please fill in all fields.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('content', `${title}\n\n${description}`)
      if (file) {
        formData.append('image', file)
      }

      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || `Something went wrong (status ${res.status})`)
      }

      setMessage('Post created successfully!')
      setTitle('')
      setDescription('')
      setFile(null)
    } catch (err) {
      setMessage(err.message || 'Failed to create post.')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl w-full mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-6 mb-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center">
        📝 Create a New Post
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-5" encType="multipart/form-data">
        <div className="flex flex-col">
          <label className="font-semibold text-gray-800 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            placeholder="Enter post title"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-800 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="rounded-lg border border-gray-300 px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            placeholder="Write your post content here..."
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-800 mb-1">Upload Image/Video (optional)</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="focus:outline-none"
          />
          {file && (
            <p className="mt-1 text-sm text-gray-600">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Create Post'}
        </button>

        {message && (
          <p
            className={`text-center text-sm font-medium ${
              message.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
