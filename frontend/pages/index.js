import Link from 'next/link'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center px-6 py-12 sm:px-10 sm:py-20 bg-gradient-to-br from-white to-gray-100 ${inter.className}`}
    >
      <div className="text-center max-w-xl">
        {/* Classic Heading */}
        <h1 className="text-5xl font-serif font-semibold mb-6 tracking-wide text-gray-900">
          DailyDevHub
        </h1>

        <p className="text-lg sm:text-xl text-gray-700 max-w-md mx-auto leading-relaxed">
          Collaborate, share your progress, and keep your developer streak alive with our vibrant community.
        </p>

        {/* Removed duplicate app name here */}

        <div className="mt-12">
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg shadow-md text-lg font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-4 focus:ring-gray-400"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  )
}
