"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import fallaciesData from "../data/fallacies.json"
import FallacyDisplay from "./fallacy-display" // Import the new component

interface Fallacy {
  name: string
  description: string
  logicalForm: string
  example: string
  category: string
  altNames: string[]
  source: string
}

export default function ExamplesSection() {
  const [currentFallacy, setCurrentFallacy] = useState<Fallacy | null>(null)

  const getRandomFallacy = () => {
    const randomIndex = Math.floor(Math.random() * fallaciesData.length)
    setCurrentFallacy(fallaciesData[randomIndex] as Fallacy)
  }

  useEffect(() => {
    getRandomFallacy()
  }, [])

  if (!currentFallacy) {
    return (
      <section id="examples" className="py-12 bg-neutral-100 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-950"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="examples" className="py-12 bg-neutral-100 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-950 mb-4">Learn with an Example</h2>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Explore a random fallacy from our database to understand how they work.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
                <Button
                  onClick={getRandomFallacy}
                  variant="outline"
                  className="border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Show Another Example
                </Button>
            </div>
          
            <FallacyDisplay fallacy={currentFallacy} />
        </div>
      </div>
    </section>
  )
}
