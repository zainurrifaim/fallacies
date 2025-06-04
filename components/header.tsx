import Link from "next/link"
import MobileMenu from "@/components/mobile-menu"
import { Lightbulb } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b border-neutral-300 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neutral-950 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-neutral-950 truncate">
                <span className="hidden sm:inline">Logical Fallacy Checker</span>
                <span className="sm:hidden">Fallacy Checker</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#about" className="text-neutral-700 hover:text-neutral-950 transition-colors">
              About
            </Link>
            <Link href="#examples" className="text-neutral-700 hover:text-neutral-950 transition-colors">
              Examples
            </Link>
            <Link href="#fallacies" className="text-neutral-700 hover:text-neutral-950 transition-colors">
              Fallacy List
            </Link>
          </nav>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}