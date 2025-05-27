"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Fallacy {
  name: string
  description: string
  logicalForm: string
  example: string
  category: string
  explanation: string
}

export default function LogicalFallacyDetector() {
  const [text, setText] = useState("")
  const [fallacies, setFallacies] = useState<Fallacy[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const exampleTexts = [
    "You can't trust John's opinion on climate change because he's not a scientist.",
    "Everyone is buying this product, so it must be good.",
    "If we allow students to redo this exam, next they'll want to redo every assignment, and eventually they'll expect to pass without doing any work.",
    "You're either with us or against us in this war on terror.",
  ]

  const loadExample = (example: string) => {
    setText(example)
    setError("")
    setHasAnalyzed(false)
  }

  const analyzeFallacies = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze")
      return
    }

    setIsLoading(true)
    setError("")
    setHasAnalyzed(false)
    setDebugInfo(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      })

      // Always try to parse as JSON, even for error responses
      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        // If we can't parse JSON, the server returned HTML or plain text
        const textResponse = await response.text()
        throw new Error(`Server returned invalid response: ${textResponse.substring(0, 100)}...`)
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to analyze text")
      }

      console.log("API Response:", data)
      setFallacies(Array.isArray(data.fallacies) ? data.fallacies : [])
      setDebugInfo(data.debug)
      setHasAnalyzed(true)
    } catch (err) {
      console.error("Analysis error:", err)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      setFallacies([])
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Relevance: "bg-red-100 text-red-800 border-red-200",
      Presumption: "bg-blue-100 text-blue-800 border-blue-200",
      "Weak Induction": "bg-yellow-100 text-yellow-800 border-yellow-200",
      Ambiguity: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Logical Fallacy Detector</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Analyze your arguments and identify logical fallacies using AI-powered analysis. Enter your text below to
            get started.
          </p>
        </div>

        {/* Input Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Text Analysis
            </CardTitle>
            <CardDescription>Enter the argument or text you want to analyze for logical fallacies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your argument or text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-32 resize-none"
              disabled={isLoading}
            />

            <div className="space-y-2">
              <p className="text-sm text-slate-600">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {exampleTexts.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(example)}
                    disabled={isLoading}
                    className="text-xs h-auto py-2 px-3"
                  >
                    Example {index + 1}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">{text.length} characters</span>
              <Button onClick={analyzeFallacies} disabled={isLoading || !text.trim()} className="min-w-32">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Debug Info (Development only) */}
        {debugInfo && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <details>
                <summary className="cursor-pointer">Debug Info (Click to expand)</summary>
                <pre className="mt-2 text-xs bg-slate-100 p-2 rounded overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            </AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {hasAnalyzed && (
          <div className="space-y-6">
            {fallacies.length === 0 ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Great! No logical fallacies were detected in your text. The argument appears to be logically sound.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-2">Analysis Results</h2>
                  <p className="text-slate-600">
                    Found {fallacies.length} logical fallac{fallacies.length === 1 ? "y" : "ies"} in your text
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                  {fallacies.map((fallacy, index) => (
                    <Card key={index} className="shadow-lg border-l-4 border-l-red-500">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl text-slate-900">{fallacy.name}</CardTitle>
                          <Badge variant="outline" className={getCategoryColor(fallacy.category)}>
                            {fallacy.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-slate-700 mb-2">Description</h4>
                          <p className="text-slate-600">{fallacy.description}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-700 mb-2">How it appears in your text</h4>
                          <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border">{fallacy.explanation}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-700 mb-2">Logical Form</h4>
                          <p className="text-slate-600 font-mono text-sm bg-slate-50 p-3 rounded-lg border">
                            {fallacy.logicalForm}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-700 mb-2">Example</h4>
                          <p className="text-slate-600 italic">"{fallacy.example}"</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm border-t pt-8">
          <p>Powered by Groq AI • Built to help improve logical reasoning</p>
        </div>
      </div>
    </div>
  )
}
