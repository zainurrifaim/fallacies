"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const menuItems = [
    { href: "#about", label: "About" },
    { href: "#examples", label: "Examples" },
    { href: "#fallacies", label: "Fallacy List" },
  ]

  const menuContent = isOpen ? (
    <>
        {/* Mobile Menu Overlay */}
        <div
            className={`fixed inset-0 bg-black/75 z-[60] backdrop-blur-md transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={closeMenu}
            aria-hidden="true"
        />

        {/* Menu Panel */}
        <div
            className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <span className="text-lg font-semibold text-neutral-950">Menu</span>
                <Button
                variant="ghost"
                size="sm"
                onClick={closeMenu}
                className="p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-full"
                aria-label="Close menu"
                >
                <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                {menuItems.map((item, index) => (
                    <li key={index}>
                    <a
                        href={item.href}
                        onClick={closeMenu}
                        className="flex items-center py-3 px-4 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-md transition-colors"
                    >
                        <span className="text-base font-medium">{item.label}</span>
                    </a>
                    </li>
                ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200">
                <p className="text-sm text-neutral-500 text-center">Logical Fallacy Checker</p>
            </div>
            </div>
        </div>
    </>
  ) : null;

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-md"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <Menu className="h-6 w-6" />
      </Button>
      
      {isMounted ? createPortal(menuContent, document.body) : null}

    </div>
  )
}
