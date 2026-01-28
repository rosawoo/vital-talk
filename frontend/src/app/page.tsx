import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Vital Talk</h1>
                <p className="text-xs text-slate-500">Medical Communication Training</p>
              </div>
            </div>
            <Link 
              href="/scenarios"
              className="btn-primary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            AI-Powered Training Platform
          </div>
          
          <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Master Difficult Conversations
            <br />
            <span className="text-sky-500">Before They Matter Most</span>
          </h2>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Practice end-of-life conversations with emotionally intelligent AI agents. 
            Build confidence, refine your approach, and deliver compassionate care.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/scenarios"
              className="btn-primary text-lg px-8 py-4"
            >
              Start Training Session
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Why Vital Talk?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Dynamic Emotions</h4>
              <p className="text-slate-600 text-sm">
                Experience realistic emotional transitions from denial to acceptance in real-time conversations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Pause & Retry</h4>
              <p className="text-slate-600 text-sm">
                Take your time. Pause conversations, redo responses, and experiment with different approaches.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Detailed Analytics</h4>
              <p className="text-slate-600 text-sm">
                Receive comprehensive feedback on empathy, clarity, emotional alignment, and cultural sensitivity.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Safe Environment</h4>
              <p className="text-slate-600 text-sm">
                Practice without consequences. Build skills in a controlled setting before real patient interactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="card p-12 bg-gradient-to-br from-sky-500 to-sky-600 border-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
              <div>
                <div className="text-4xl font-bold mb-2">5+</div>
                <div className="text-sky-100">Emotional States</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">Unlimited</div>
                <div className="text-sky-100">Practice Sessions</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">Real-time</div>
                <div className="text-sky-100">Voice Interactions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to Transform Your Communication Skills?
          </h3>
          <p className="text-lg text-slate-600 mb-8">
            Join emergency physicians and medical professionals who are mastering 
            difficult conversations with AI-powered training.
          </p>
          <Link 
            href="/scenarios"
            className="btn-primary text-lg px-10 py-4 inline-block"
          >
            Begin Your First Scenario
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              © 2026 Vital Talk. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-slate-600">
              <a href="#" className="hover:text-sky-500 transition-colors">Documentation</a>
              <a href="#" className="hover:text-sky-500 transition-colors">Support</a>
              <a href="#" className="hover:text-sky-500 transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
