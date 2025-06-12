"use client"

import { useState, useEffect } from "react"
import MobileMenu from "./mobile-menu" // Corrected import path
import { Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  // Effect to detect page scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300",
        scrolled
          ? "shadow-md bg-white/90 backdrop-blur-lg border-neutral-200"
          : "bg-white"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Site branding */}
          <div className="flex items-center flex-shrink-0">
            <a href="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-neutral-950 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-neutral-950 truncate">
                <span className="hidden sm:inline">Logical Fallacy Checker</span>
                <span className="sm:hidden">Fallacy Checker</span>
              </h1>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#about" className="text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors">
              About
            </a>
            <a href="#examples" className="text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors">
              Examples
            </a>
            <a href="#fallacies" className="text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors">
              Fallacy List
            </a>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
