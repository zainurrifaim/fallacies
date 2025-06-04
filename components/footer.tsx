export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm text-gray-300">
            © 2024 Science Misconception Analyzer. Built for educators to enhance science learning.
          </p>
          <div className="mt-2 space-x-4 text-xs text-gray-400">
            <span>Powered by Groq AI</span>
            <span>•</span>
            <span>Built with Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
