"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, BookOpen } from "lucide-react"
import fallaciesData from "../data/fallacies.json"

interface Fallacy {
  name: string
  description: string
  logicalForm: string
  example: string
  category: string
  altNames: string[]
}

export default function FallacyListSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFallacy, setExpandedFallacy] = useState<string | null>(null)

  const toggleExpand = (name: string) => {
    if (expandedFallacy === name) {
      setExpandedFallacy(null)
    } else {
      setExpandedFallacy(name)
    }
  }

  const filteredFallacies = fallaciesData.filter((fallacy: Fallacy) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      fallacy.name.toLowerCase().includes(searchLower) ||
      fallacy.description.toLowerCase().includes(searchLower) ||
      fallacy.category.toLowerCase().includes(searchLower) ||
      fallacy.altNames.some((name) => name.toLowerCase().includes(searchLower))
    )
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Relevance: "bg-neutral-100 text-neutral-800 border-neutral-300",
      Presumption: "bg-neutral-200 text-neutral-900 border-neutral-400",
      Ambiguity: "bg-neutral-150 text-neutral-850 border-neutral-350",
      Appeal: "bg-neutral-100 text-neutral-800 border-neutral-300",
    }
    return colors[category] || "bg-neutral-100 text-neutral-800 border-neutral-300"
  }

  // Group fallacies by category
  const fallaciesByCategory: Record<string, Fallacy[]> = {}
  filteredFallacies.forEach((fallacy: Fallacy) => {
    if (!fallaciesByCategory[fallacy.category]) {
      fallaciesByCategory[fallacy.category] = []
    }
    fallaciesByCategory[fallacy.category].push(fallacy)
  })

  const hasSearchTerm = searchTerm.trim().length > 0

  return (
    <section id="fallacies" className="py-12 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-950 mb-4">Fallacy Reference List</h2>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Search our comprehensive database of logical fallacies to learn more about each one.
          </p>
        </div>

        <div className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search fallacies by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500"
          />
        </div>

        {!hasSearchTerm ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-neutral-950 mb-2">Ready to Explore?</h3>
            <p className="text-neutral-700 max-w-md mx-auto">
              Use the search box above to find specific logical fallacies. You can search by name, description, or
              category.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="bg-neutral-100 text-neutral-700">
                Try: "ad hominem"
              </Badge>
              <Badge variant="outline" className="bg-neutral-100 text-neutral-700">
                Try: "appeal"
              </Badge>
              <Badge variant="outline" className="bg-neutral-100 text-neutral-700">
                Try: "relevance"
              </Badge>
            </div>
          </div>
        ) : Object.keys(fallaciesByCategory).length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-neutral-950 mb-2">No Results Found</h3>
            <p className="text-neutral-700">
              No fallacies match your search for "{searchTerm}". Try different keywords or check your spelling.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(fallaciesByCategory).map(([category, fallacies]) => (
              <div key={category}>
                <h3 className="text-2xl font-semibold text-neutral-950 mb-4 border-b border-neutral-300 pb-2">
                  {category} Fallacies ({fallacies.length})
                </h3>
                <div className="space-y-4">
                  {fallacies.map((fallacy: Fallacy) => (
                    <Card
                      key={fallacy.name}
                      className="border-neutral-300 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => toggleExpand(fallacy.name)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <CardTitle className="text-lg text-neutral-950">{fallacy.name}</CardTitle>
                          <Badge variant="outline" className={getCategoryColor(fallacy.category)}>
                            {fallacy.category}
                          </Badge>
                        </div>
                        <CardDescription className="text-neutral-700 mt-1">{fallacy.description}</CardDescription>
                      </CardHeader>
                      {expandedFallacy === fallacy.name && (
                        <CardContent className="pt-0 border-t border-neutral-200 mt-2">
                          <div className="space-y-4 pt-4">
                            <div>
                              <h4 className="font-medium text-neutral-950 mb-2">Logical Form:</h4>
                              <p className="text-neutral-700 font-mono text-sm bg-neutral-50 p-3 rounded border border-neutral-200">
                                {fallacy.logicalForm}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium text-neutral-950 mb-2">Example:</h4>
                              <p className="text-neutral-700 italic">"{fallacy.example}"</p>
                            </div>
                            {fallacy.altNames.length > 0 && (
                              <div>
                                <h4 className="font-medium text-neutral-950 mb-2">Also known as:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {fallacy.altNames.map((altName, altIndex) => (
                                    <Badge
                                      key={altIndex}
                                      variant="secondary"
                                      className="bg-neutral-100 text-neutral-700"
                                    >
                                      {altName}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
