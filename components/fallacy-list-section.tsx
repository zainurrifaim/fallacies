"use client"

import { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import fallaciesData from "@/data/fallacies.json"
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

export default function FallacyListSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleExpandCategory = (category: string) => {
    setExpandedCategories(prev => 
        prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }
  
  // When a search term is entered, expand all categories to show results
  const categoriesToDisplay = useMemo(() => {
    const grouped: Record<string, Fallacy[]> = {}
    const searchLower = searchTerm.toLowerCase()
    
    const filtered = (fallaciesData as Fallacy[]).filter((fallacy) => {
      if (!searchTerm.trim()) return true
      return (
        fallacy.name.toLowerCase().includes(searchLower) ||
        fallacy.description.toLowerCase().includes(searchLower) ||
        fallacy.category.toLowerCase().includes(searchLower) ||
        fallacy.altNames.some((name) => name.toLowerCase().includes(searchLower))
      )
    })
    
    filtered.forEach((fallacy) => {
      if (!grouped[fallacy.category]) {
        grouped[fallacy.category] = []
      }
      grouped[fallacy.category].push(fallacy)
    })
    
    if (searchTerm.trim() && Object.keys(grouped).length > 0) {
      setExpandedCategories(Object.keys(grouped));
    } else if (!searchTerm.trim()){
      setExpandedCategories([]);
    }
    
    return grouped
  }, [searchTerm])


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

        {Object.keys(categoriesToDisplay).length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-neutral-950 mb-2">No Results Found</h3>
            <p className="text-lg text-neutral-700">
              No fallacies match your search for "{searchTerm}".
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {Object.entries(categoriesToDisplay).map(([category, fallacies]) => (
              <div key={category} className="border border-neutral-200 rounded-lg bg-white shadow-sm">
                <h3 
                    className="text-xl font-semibold text-neutral-900 p-4 flex justify-between items-center cursor-pointer hover:bg-neutral-50 rounded-t-lg"
                    onClick={() => toggleExpandCategory(category)}
                >
                  <span>{category} ({fallacies.length})</span>
                  {expandedCategories.includes(category) ? <ChevronUp className="h-5 w-5 text-neutral-600"/> : <ChevronDown className="h-5 w-5 text-neutral-600"/>}
                </h3>
                {expandedCategories.includes(category) && (
                    <div className="space-y-4 p-4 border-t border-neutral-200">
                      {fallacies.map((fallacy) => (
                        <FallacyDisplay key={fallacy.name} fallacy={fallacy} />
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
