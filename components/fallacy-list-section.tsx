"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, ChevronUp, Link as LinkIcon } from "lucide-react"
import fallaciesData from "../data/fallacies.json"

interface Fallacy {
  name: string
  description: string
  logicalForm: string
  example: string
  category: string
  altNames: string[]
  source: string
}

export default function FallacyListSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFallacy, setExpandedFallacy] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleExpandFallacy = (name: string) => {
    setExpandedFallacy(expandedFallacy === name ? null : name)
  }
  
  const toggleExpandCategory = (category: string) => {
    setExpandedCategories(prev => 
        prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const filteredFallacies = useMemo(() => {
    if (!searchTerm.trim()) {
      return fallaciesData as Fallacy[]
    }
    const searchLower = searchTerm.toLowerCase()
    return (fallaciesData as Fallacy[]).filter((fallacy) => 
      fallacy.name.toLowerCase().includes(searchLower) ||
      fallacy.description.toLowerCase().includes(searchLower) ||
      fallacy.category.toLowerCase().includes(searchLower) ||
      fallacy.altNames.some((name) => name.toLowerCase().includes(searchLower))
    )
  }, [searchTerm])

  const fallaciesByCategory = useMemo(() => {
    const grouped: Record<string, Fallacy[]> = {}
    filteredFallacies.forEach((fallacy) => {
      if (!grouped[fallacy.category]) {
        grouped[fallacy.category] = []
      }
      grouped[fallacy.category].push(fallacy)
    })
    return grouped
  }, [filteredFallacies])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Fallacies of Relevance": "bg-blue-100 text-blue-800 border-blue-300",
      "Fallacies of Presumption": "bg-green-100 text-green-800 border-green-300",
      "Fallacies of Ambiguity": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Formal Fallacies": "bg-purple-100 text-purple-800 border-purple-300",
    }
    return colors[category] || "bg-neutral-100 text-neutral-800 border-neutral-300"
  }

  return (
    <section id="fallacies" className="py-12 bg-neutral-50/75 scroll-mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-neutral-950 mb-4">Fallacy Reference</h2>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto">
            Browse our comprehensive database to learn about logical fallacies. Use the search to filter the list.
          </p>
        </div>

        <div className="mb-8 relative max-w-2xl mx-auto">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-neutral-500 h-5 w-5" />
          <Input
            type="text"
            placeholder="Filter fallacies by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-11 text-base border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500"
          />
        </div>

        {Object.keys(fallaciesByCategory).length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-neutral-950 mb-2">No Results Found</h3>
            <p className="text-lg text-neutral-700">
              No fallacies match your search for "{searchTerm}".
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {Object.entries(fallaciesByCategory).map(([category, fallacies]) => (
              <div key={category} className="border border-neutral-200 rounded-lg bg-white shadow-sm">
                <h3 
                    className="text-xl font-semibold text-neutral-900 p-4 flex justify-between items-center cursor-pointer hover:bg-neutral-50"
                    onClick={() => toggleExpandCategory(category)}
                >
                  <span>{category} ({fallacies.length})</span>
                  {expandedCategories.includes(category) ? <ChevronUp className="h-5 w-5 text-neutral-600"/> : <ChevronDown className="h-5 w-5 text-neutral-600"/>}
                </h3>
                {expandedCategories.includes(category) && (
                    <div className="space-y-4 p-4 border-t border-neutral-200">
                      {fallacies.map((fallacy) => (
                        <Card
                          key={fallacy.name}
                          className="border-neutral-200 shadow-sm overflow-hidden"
                        >
                          <CardHeader className="pb-4 cursor-pointer" onClick={() => toggleExpandFallacy(fallacy.name)}>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <CardTitle className="text-lg text-neutral-900">{fallacy.name}</CardTitle>
                              <div className="flex items-center gap-4">
                                <Badge variant="outline" className={getCategoryColor(fallacy.category)}>
                                  {fallacy.category}
                                </Badge>
                                 {expandedFallacy === fallacy.name ? <ChevronUp className="h-5 w-5 text-neutral-600"/> : <ChevronDown className="h-5 w-5 text-neutral-600"/>}
                              </div>
                            </div>
                          </CardHeader>
                          {expandedFallacy === fallacy.name && (
                            <CardContent className="pt-4 border-t border-neutral-200 animate-in fade-in-0 slide-in-from-top-2 duration-500">
                              <div className="space-y-5">
                                <div>
                                   <h4 className="font-semibold text-neutral-800 mb-2 text-base">Description:</h4>
                                   <p className="text-neutral-700 leading-relaxed">{fallacy.description}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-neutral-800 mb-2 text-base">Logical Form:</h4>
                                  <p className="text-neutral-700 font-mono text-sm bg-neutral-100 p-3 rounded-md border border-neutral-200">
                                    {fallacy.logicalForm}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-neutral-800 mb-2 text-base">Example:</h4>
                                  <p className="text-neutral-700 italic bg-neutral-50 p-3 rounded-md border border-dashed border-neutral-300">"{fallacy.example}"</p>
                                </div>
                                {fallacy.altNames.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-neutral-800 mb-2 text-base">Also known as:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {fallacy.altNames.map((altName, altIndex) => (
                                        <Badge
                                          key={altIndex}
                                          variant="secondary"
                                          className="bg-neutral-200 text-neutral-700"
                                        >
                                          {altName}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {fallacy.source && (
                                    <div>
                                        <h4 className="font-semibold text-neutral-800 mb-2 text-base">Reference:</h4>
                                        <a href={fallacy.source} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 text-sm">
                                            <LinkIcon className="h-3 w-3"/>
                                            {fallacy.source}
                                        </a>
                                    </div>
                                )}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
