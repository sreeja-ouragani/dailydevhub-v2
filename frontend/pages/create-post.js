import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/api'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
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

      const res = await fetch(`${API_BASE_URL}/posts`, {
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
    <div className="max-w-xl w-full mx-auto bg-white rounded-2xl shadow-lg px-4 py-6 sm:p-8 mt-6 mb-12">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-[#7C3AED] mb-6">
        📝 Create a New Post
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4" encType="multipart/form-data">
        <div className="flex flex-col">
          <label className="text-sm sm:text-base font-semibold text-[#1F2937] mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-[#DDD6FE] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-[#1F2937] bg-white"
            placeholder="Enter post title"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm sm:text-base font-semibold text-[#1F2937] mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="rounded-lg border border-[#DDD6FE] px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-[#1F2937] bg-white"
            placeholder="Write your post content here..."
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm sm:text-base font-semibold text-[#1F2937] mb-1">
            Upload Image/Video (optional)
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="focus:outline-none text-[#1F2937]"
          />
          {file && (
            <p className="mt-1 text-sm text-[#7C3AED]">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#7C3AED] hover:bg-[#6B21A8] transition text-white font-semibold py-3 rounded-lg focus:outline-none disabled:opacity-50"
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
