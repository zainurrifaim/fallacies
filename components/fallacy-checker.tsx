"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"

interface AnalyzedFallacy {
  name: string
  description: string
  logicalForm: string
  example: string
  category: string
  altNames: string[]
  explanation: string
}

interface AnalysisResult {
  fallacies: AnalyzedFallacy[]
  debug?: {
    rawResponse: string
  }
}

const exampleTexts = [
  "You can't trust John's opinion on climate change because he's not a scientist.",
  "Everyone is buying this product, so it must be good.",
  "If we allow students to redo tests, next they'll want to redo entire courses.",
  "You're either with us or against us in this fight for freedom.",
]

export default function FallacyChecker() {
  const [text, setText] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeText = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze text")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (exampleText: string) => {
    setText(exampleText)
    setResult(null)
    setError(null)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Relevance: "bg-neutral-100 text-neutral-800 border-neutral-300",
      Presumption: "bg-neutral-200 text-neutral-900 border-neutral-400",
      Ambiguity: "bg-neutral-150 text-neutral-850 border-neutral-350",
      Appeal: "bg-neutral-100 text-neutral-800 border-neutral-300",
    }
    return colors[category] || "bg-neutral-100 text-neutral-800 border-neutral-300"
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4 px-2">Logical Fallacy Checker</h1>
        <p className="text-lg sm:text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed px-4">
          Analyze your arguments and reasoning for logical fallacies. Improve your critical thinking skills with
          AI-powered analysis.
        </p>
      </div>

      {/* Main Analysis Section */}
      <Card className="mb-6 sm:mb-8 shadow-lg border-neutral-300">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-neutral-950">Analyze Your Text</CardTitle>
          <CardDescription className="text-neutral-700">
            Enter any argument, statement, or reasoning you'd like to check for logical fallacies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div>
            <Textarea
              placeholder="Enter your text here for analysis..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-32 border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500 text-sm sm:text-base"
            />
          </div>

          {/* Add example buttons here */}
          <div>
            <p className="text-sm text-neutral-600 mb-3">Quick examples:</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {exampleTexts.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => loadExample(example)}
                  className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs"
                >
                  Example {index + 1}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-center">
            <Button
              onClick={analyzeText}
              disabled={!text.trim() || loading}
              className="bg-neutral-950 hover:bg-neutral-800 text-white w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                "Analyze Text"
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setText("")
                setResult(null)
                setError(null)
              }}
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 w-full sm:w-auto"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="mb-8 border-red-300 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-800">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {result && (
        <Card className="shadow-lg border-neutral-300">
          <CardHeader>
            <CardTitle className="text-2xl text-neutral-950 flex items-center">
              {result.fallacies.length > 0 ? (
                <>
                  <AlertCircle className="w-6 h-6 mr-2 text-orange-600" />
                  Fallacies Detected ({result.fallacies.length})
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                  No Fallacies Detected
                </>
              )}
            </CardTitle>
            <CardDescription className="text-neutral-700">
              {result.fallacies.length > 0
                ? "The following logical fallacies were identified in your text:"
                : "Your text appears to be free of common logical fallacies. Great reasoning!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result.fallacies.length > 0 ? (
              <div className="space-y-6">
                {result.fallacies.map((fallacy, index) => (
                  <div key={index} className="border border-neutral-300 rounded-lg p-6 bg-white">
                    <div className="flex flex-wrap items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-neutral-950">{fallacy.name}</h3>
                      <Badge variant="outline" className={getCategoryColor(fallacy.category)}>
                        {fallacy.category}
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-neutral-950 mb-2">How it appears in your text:</h4>
                        <p className="text-neutral-700 bg-neutral-50 p-3 rounded border border-neutral-200">
                          {fallacy.explanation}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-neutral-950 mb-2">Description:</h4>
                        <p className="text-neutral-700">{fallacy.description}</p>
                      </div>

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
                              <Badge key={altIndex} variant="secondary" className="bg-neutral-100 text-neutral-700">
                                {altName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <p className="text-lg text-neutral-700">Excellent! Your reasoning appears to be logically sound.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
