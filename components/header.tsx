import { BookOpen, Brain } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <BookOpen className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Science Misconception Analyzer</h1>
            <p className="text-gray-600 mt-1">
              AI-powered tool to identify and address student misconceptions in science
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
