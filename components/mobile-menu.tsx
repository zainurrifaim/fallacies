"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <div className="md:hidden">
      {/* Improved Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="relative h-10 w-10 rounded-full hover:bg-neutral-100 transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className={`h-5 w-5 absolute transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
        }`} />
        <X className={`h-5 w-5 absolute transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
        }`} />
      </Button>

      {/* Mobile Menu Overlay with improved transitions */}
      {isOpen && (
        <>
          {/* Backdrop with fade effect */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={closeMenu}
          />

          {/* Menu Panel with slide effect */}
          <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-50 transform transition-all duration-300 ease-out ${
            isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}>
            <div className="flex flex-col h-full">
              {/* Header with improved styling */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <span className="text-lg font-semibold text-neutral-950">Navigation</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMenu}
                  className="h-8 w-8 rounded-full hover:bg-neutral-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation Links with improved styling */}
              <nav className="flex-1 p-6">
                <div className="space-y-2">
                  {[
                    { href: "#about", label: "About" },
                    { href: "#examples", label: "Examples" },
                    { href: "#fallacies", label: "Fallacy List" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="flex items-center w-full py-2.5 px-4 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
