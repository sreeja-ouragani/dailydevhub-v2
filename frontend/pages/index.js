import React from 'react';

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative 
                 bg-gradient-to-br from-purple-50 to-white via-blue-50
                 overflow-hidden font-sans"
    >
      {/* Background Gradient Animation */}
      <div className="absolute inset-0 z-0 animate-gradient-shift">
        <div className="w-full h-full bg-gradient-to-br from-[#F3E8FF] to-white opacity-60"></div>
      </div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 bg-[#7C3AED] text-white px-6 py-4 shadow-xl z-10 w-full">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-extrabold tracking-wide">DailyDevHub</h1>
          <a
            href="/signup"
            className="bg-white text-[#7C3AED] px-5 py-2 rounded-lg font-semibold hover:bg-purple-100 transition-all duration-300 shadow-md"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 text-center max-w-2xl mx-auto p-8 sm:p-10 md:p-12 
                       bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-purple-200 
                       border border-purple-100 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 
               text-[#7C3AED] leading-tight drop-shadow-lg">
  DailyDevHub
  
  <span className="block text-sm sm:text-base text-gray-600 font-medium mt-2 italic">
    "Code. Collaborate. Conquer. Every day is progress."
  </span>
</h1>

        
        <div className="mt-8">
          <a
            href="/login"
            className="inline-block px-8 py-3 bg-[#7C3AED] text-white 
                       rounded-full shadow-lg text-lg font-bold 
                       hover:bg-[#6B21A8] hover:scale-105 transform transition-all duration-300 
                       focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-75 
                       animate-bounce-subtle"
          >
            Get Started
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 bg-[#DDD6FE] text-[#4C1D95] 
                         py-4 text-center text-sm font-medium shadow-inner z-10 w-full">
        © 2025 DailyDevHub – Where devs grow together.
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradientShift 20s ease infinite;
        }

        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .animate-bounce-subtle {
          animation: bounceSubtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
