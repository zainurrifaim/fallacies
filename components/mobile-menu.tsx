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
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMenu} />

          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-300">
                <span className="text-lg font-semibold text-neutral-950">Menu</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMenu}
                  className="p-2 text-neutral-700 hover:text-neutral-950"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-4">
                <div className="space-y-4">
                  <Link
                    href="#about"
                    onClick={closeMenu}
                    className="block py-2 px-3 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    href="#examples"
                    onClick={closeMenu}
                    className="block py-2 px-3 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    Examples
                  </Link>
                  <Link
                    href="#fallacies"
                    onClick={closeMenu}
                    className="block py-2 px-3 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-md transition-colors"
                  >
                    Fallacy List
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
