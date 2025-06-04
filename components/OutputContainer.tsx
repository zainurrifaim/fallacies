"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CheckCircle, Lightbulb, Copy, Loader2, Brain, RefreshCw } from "lucide-react"
import type { AnalysisResponse } from "@/types"
import { useState } from "react"

interface OutputContainerProps {
  result: AnalysisResponse | null
  isLoading: boolean
  error: string | null
  onRetry?: () => void
}

export default function OutputContainer({ result, isLoading, error, onRetry }: OutputContainerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!result) return

    const text = `
Science Misconception Analysis Results

Misconceptions Identified:
${result.misconceptions?.map((m, i) => `${i + 1}. ${m.description}\n   Explanation: ${m.explanation}\n   Confidence: ${m.confidence}%`).join("\n\n") || "None identified"}

Correct Concepts:
${result.correctConcepts?.length > 0 ? result.correctConcepts.map(c => `- ${c}`).join("\n") : "None specified"}

Teaching Suggestions:
${result.teachingSuggestions?.map((s, i) => `${i + 1}. ${s.strategy}\n   Implementation: ${s.implementation}`).join("\n\n") || "None provided"}

Overall Confidence: ${result.overallConfidence || "N/A"}%
    `.trim()

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  const isParsingError = error?.includes("Failed to parse") || error?.includes("Invalid response structure")

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
            <p className="text-gray-600">Analyzing student response for misconceptions...</p>
            <p className="text-gray-400 text-xs">This may take 10-30 seconds</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
            <div>
              <h3 className="font-semibold text-red-800">
                {isParsingError ? "Response Format Error" : "Analysis Error"}
              </h3>
              <p className="text-red-600 text-sm mt-1 max-w-md mx-auto">
                {isParsingError 
                  ? "The AI response couldn't be processed. This sometimes happens with complex analyses. Please try again."
                  : error
                }
              </p>
            </div>
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return (
      <Card className="w-full">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
              <Brain className="h-4 w-4 text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Ready for Analysis</h3>
              <p className="text-gray-500 text-sm">
                Enter educational context and student answer to begin misconception analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Safely access result properties with fallbacks
  const misconceptions = result.misconceptions || []
  const correctConcepts = result.correctConcepts || []
  const teachingSuggestions = result.teachingSuggestions || []
  const overallConfidence = result.overallConfidence || 0
  const frameworkAnalysis = result.frameworkAnalysis

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Analysis Results</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Overall Confidence: {overallConfidence}%</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Misconceptions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-red-700 flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Identified Misconceptions ({misconceptions.length})</span>
          </h3>

          {misconceptions.length === 0 ? (
            <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">
              No significant misconceptions detected in this response.
            </p>
          ) : (
            <div className="space-y-3">
              {misconceptions.map((misconception, index) => (
                <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-red-800">Misconception {index + 1}</h4>
                      {misconception.category && (
                        <Badge variant="outline" className="text-xs mt-1 bg-white">
                          {misconception.category}
                        </Badge>
                      )}
                    </div>
                    {misconception.confidence && (
                      <Badge variant="destructive" className="text-xs">
                        {misconception.confidence}% confidence
                      </Badge>
                    )}
                  </div>

                  {misconception.description && (
                    <p className="text-red-700 text-sm mb-2">{misconception.description}</p>
                  )}
                  {misconception.explanation && (
                    <p className="text-red-600 text-xs mb-3">{misconception.explanation}</p>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {misconception.prevalence && (
                      <div>
                        <span className="font-medium text-red-800">Prevalence:</span>
                        <span className="text-red-600 ml-1 capitalize">{misconception.prevalence}</span>
                      </div>
                    )}
                    {misconception.persistence && (
                      <div>
                        <span className="font-medium text-red-800">Persistence:</span>
                        <span className="text-red-600 ml-1 capitalize">{misconception.persistence}</span>
                      </div>
                    )}
                    {misconception.complexity && (
                      <div>
                        <span className="font-medium text-red-800">Complexity:</span>
                        <span className="text-red-600 ml-1 capitalize">{misconception.complexity}</span>
                      </div>
                    )}
                  </div>

                  {misconception.cognitive_origins && misconception.cognitive_origins.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-red-200">
                      <span className="font-medium text-red-800 text-xs">Cognitive Origins:</span>
                      <ul className="text-red-600 text-xs mt-1 list-disc list-inside">
                        {misconception.cognitive_origins.map((origin, i) => (
                          <li key={i}>{origin}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {misconception.examples_from_framework && misconception.examples_from_framework.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-red-200">
                      <span className="font-medium text-red-800 text-xs">Framework Examples:</span>
                      <ul className="text-red-600 text-xs mt-1 list-disc list-inside">
                        {misconception.examples_from_framework.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {correctConcepts.length > 0 && (
          <>
            <Separator />
            {/* Correct Concepts */}
            <div className="space-y-4">
              <h3 className="font-semibold text-green-700 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Correct Scientific Concepts</span>
              </h3>

              <div className="space-y-2">
                {correctConcepts.map((concept, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-green-700 text-sm">{concept}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Framework Analysis */}
        {frameworkAnalysis && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold text-purple-700 flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Framework Analysis</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {frameworkAnalysis.primaryCategory && (
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800 text-sm">Primary Category</h4>
                    <p className="text-purple-700 text-sm mt-1">{frameworkAnalysis.primaryCategory}</p>
                  </div>
                )}

                {frameworkAnalysis.interventionPriority && (
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800 text-sm">Intervention Priority</h4>
                    <Badge
                      variant={
                        frameworkAnalysis.interventionPriority === "Critical"
                          ? "destructive"
                          : frameworkAnalysis.interventionPriority === "High"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {frameworkAnalysis.interventionPriority}
                    </Badge>
                  </div>
                )}

                {frameworkAnalysis.recommendedApproach && (
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800 text-sm">Recommended Approach</h4>
                    <p className="text-purple-700 text-sm mt-1">{frameworkAnalysis.recommendedApproach}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {teachingSuggestions.length > 0 && (
          <>
            <Separator />
            {/* Teaching Suggestions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-700 flex items-center space-x-2">
                <Lightbulb className="h-4 w-4" />
                <span>Teaching Suggestions</span>
              </h3>

              <div className="space-y-3">
                {teachingSuggestions.map((suggestion, index) => (
                  <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-blue-800">
                        Strategy {index + 1}: {suggestion.strategy || "Unnamed Strategy"}
                      </h4>
                      {suggestion.category_targeted && (
                        <Badge variant="outline" className="text-xs bg-white">
                          {suggestion.category_targeted}
                        </Badge>
                      )}
                    </div>

                    {suggestion.implementation && (
                      <p className="text-blue-700 text-sm mb-2">{suggestion.implementation}</p>
                    )}

                    {(suggestion.duration || suggestion.success_rate) && (
                      <div className="flex space-x-4 text-xs text-blue-600">
                        {suggestion.duration && (
                          <div>
                            <span className="font-medium">Duration:</span>
                            <span className="ml-1">{suggestion.duration}</span>
                          </div>
                        )}
                        {suggestion.success_rate && (
                          <div>
                            <span className="font-medium">Success Rate:</span>
                            <span className="ml-1">{suggestion.success_rate}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}