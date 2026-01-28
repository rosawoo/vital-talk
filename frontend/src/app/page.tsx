import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Vital Talk
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-Powered Training for End-of-Life Conversations
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Practice difficult conversations with emotion-driven AI agents in a safe, 
            reflective environment. Designed for emergency physicians and medical professionals.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">🎭</div>
            <h3 className="text-xl font-semibold mb-2">Realistic Emotions</h3>
            <p className="text-gray-600">
              Experience dynamic emotional reactions including denial, anger, bargaining, 
              sadness, and acceptance.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">⏮️</div>
            <h3 className="text-xl font-semibold mb-2">Pause & Redo</h3>
            <p className="text-gray-600">
              Practice without pressure. Pause, rewind, and try different approaches 
              to find what works best.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-2">Detailed Feedback</h3>
            <p className="text-gray-600">
              Receive structured feedback on empathy, clarity, emotional alignment, 
              and cultural sensitivity.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-xl font-semibold mb-2">Safe Practice</h3>
            <p className="text-gray-600">
              Learn and make mistakes in a controlled environment without 
              real-world consequences.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/scenarios"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
          >
            Start Training
          </Link>
        </div>
      </div>
    </main>
  )
}
