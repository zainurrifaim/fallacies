"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import fallaciesData from "../data/fallacies.json"

interface Fallacy {
  name: string
  description: string
  logicalForm: string
  example: string
  category: string
  altNames: string[]
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Relevance: "bg-neutral-100 text-neutral-800 border-neutral-300",
      Presumption: "bg-neutral-200 text-neutral-900 border-neutral-400",
      Ambiguity: "bg-neutral-150 text-neutral-850 border-neutral-350",
      Appeal: "bg-neutral-100 text-neutral-800 border-neutral-300",
    }
    return colors[category] || "bg-neutral-100 text-neutral-800 border-neutral-300"
  }

  if (!currentFallacy) {
    return (
      <section id="examples" className="py-12 bg-neutral-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-950"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="examples" className="py-12 bg-neutral-50 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-950 mb-4">Fallacy Example</h2>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Learn about logical fallacies with real examples from our database.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-neutral-300 shadow-lg">
            <CardHeader className="pb-4">
              <div className="text-center">
                <Button
                  onClick={getRandomFallacy}
                  variant="outline"
                  className="border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Show Another Example
                </Button>
              </div>
              
              <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                <CardTitle className="text-2xl text-neutral-950 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2 text-orange-600" />
                  {currentFallacy.name}
                </CardTitle>
                <Badge variant="outline" className={getCategoryColor(currentFallacy.category)}>
                  {currentFallacy.category}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-neutral-950 mb-3">Description:</h4>
                  <p className="text-neutral-700 text-lg">{currentFallacy.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-neutral-950 mb-3">Example:</h4>
                  <div className="bg-neutral-100 border border-neutral-300 rounded-lg p-4">
                    <p className="text-neutral-800 italic text-lg">"{currentFallacy.example}"</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-neutral-950 mb-3">Logical Form:</h4>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                    <p className="text-neutral-700 font-mono text-sm">{currentFallacy.logicalForm}</p>
                  </div>
                </div>

                {currentFallacy.altNames.length > 0 && (
                  <div>
                    <h4 className="font-medium text-neutral-950 mb-3">Also known as:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentFallacy.altNames.map((altName, index) => (
                        <Badge key={index} variant="secondary" className="bg-neutral-100 text-neutral-700">
                          {altName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}