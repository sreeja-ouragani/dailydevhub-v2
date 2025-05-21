import { useState } from 'react'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !description) {
      setMessage('Please fill in all fields.')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      // Replace with your API call
      // await fetch('/api/posts', { method: 'POST', body: JSON.stringify({ title, description }) })
      setMessage('Post created successfully!')
      setTitle('')
      setDescription('')
    } catch (err) {
      setMessage('Failed to create post.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-10">
      <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">📝 Create a New Post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
        <label className="flex flex-col">
          <span className="font-semibold text-gray-700 mb-1">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter post title"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-semibold text-gray-700 mb-1">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="rounded-md border border-gray-300 px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Write your post content here..."
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Create Post'}
        </button>

        {message && (
          <p className={`text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
