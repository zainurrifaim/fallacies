"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, ChevronDown, HelpCircle, Lightbulb, ClipboardCopy } from "lucide-react"
import FallacyDisplay from "@/components/fallacy-display"

interface AnalyzedFallacy {
  name: string
  description: string
  logicalForm: string
  example: string
  category: string
  altNames: string[]
  source: string
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
  const [context, setContext] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showContext, setShowContext] = useState(false)
  const [analysisPerformed, setAnalysisPerformed] = useState(false)
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const analyzeText = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)
    setAnalysisPerformed(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim(), context: context.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze text")
      }

      const data = await response.json()
      setResult(data)
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const resetChecker = () => {
    setText("")
    setContext("")
    setResult(null)
    setError(null)
    setAnalysisPerformed(false)
    setShowContext(false)
  }

  const loadExample = (exampleText: string) => {
    setText(exampleText)
    setContext("")
    setResult(null)
    setError(null)
    setAnalysisPerformed(false)
  }
  
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-950 mb-4 px-2">Logical Fallacy Checker</h1>
        <p className="text-lg sm:text-xl text-neutral-700 max-w-3xl mx-auto leading-relaxed px-4">
          Improve your critical thinking. Analyze arguments for logical fallacies with AI-powered insights.
        </p>
      </div>
      
      <Card className="mb-6 sm:mb-8 bg-neutral-50 border-neutral-200 shadow-sm">
        <CardHeader>
            <CardTitle className="text-xl text-neutral-900 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-neutral-600"/>
                How to Use This Tool
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="mb-3 flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full font-bold text-xl">1</div>
                    <h3 className="font-semibold text-neutral-800 mb-1">Enter Text</h3>
                    <p className="text-neutral-600 text-sm">Paste the argument or statement you want to analyze.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="mb-3 flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full font-bold text-xl">2</div>
                    <h3 className="font-semibold text-neutral-800 mb-1">Add Context (Optional)</h3>
                    <p className="text-neutral-600 text-sm">Provide background information for a more accurate analysis.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="mb-3 flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-full font-bold text-xl">3</div>
                    <h3 className="font-semibold text-neutral-800 mb-1">Analyze & Review</h3>
                    <p className="text-neutral-600 text-sm">Click 'Analyze' and review the AI-generated results below.</p>
                </div>
            </div>
        </CardContent>
      </Card>


      <Card className="mb-6 sm:mb-8 shadow-lg border-neutral-300">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-neutral-950">Analyze Text</CardTitle>
          <CardDescription className="text-neutral-700">
            Enter an argument to check for logical fallacies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div>
            <Textarea
              placeholder="Enter the primary text or argument here for analysis..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-36 border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500 text-base"
              aria-label="Text to analyze"
            />
          </div>

          <div>
              <Button variant="link" onClick={() => setShowContext(!showContext)} className="text-neutral-600 px-0">
                  <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${showContext ? 'rotate-180' : ''}`}/>
                  {showContext ? "Hide Optional Context" : "Add Optional Context"}
              </Button>
              {showContext && (
                <Textarea
                    placeholder="Provide any relevant context here. For example, 'This was said during a political debate.' or 'The following is a sarcastic comment on a forum.'"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="min-h-24 border-neutral-300 focus:border-neutral-500 focus:ring-neutral-500 text-sm mt-2 animate-in fade-in-0 duration-300"
                    aria-label="Optional context"
                />
              )}
          </div>

          <div>
            <p className="text-sm text-neutral-600 mb-3">Or try a quick example:</p>
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

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 sm:justify-center pt-4 border-t border-neutral-200">
            <Button
              onClick={analyzeText}
              disabled={!text.trim() || loading}
              className="bg-neutral-950 hover:bg-neutral-800 text-white w-full sm:w-32"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                analysisPerformed ? "Recheck" : "Analyze Text"
              )}
            </Button>
            <Button
              onClick={resetChecker}
              variant="outline"
              className="w-full sm:w-32"
              disabled={loading}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <div ref={resultsRef} className="scroll-mt-8">
        {error && (
            <Card className="mb-8 border-red-300 bg-red-50">
            <CardContent className="pt-6">
                <div className="flex items-center text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>Error: {error}</span>
                </div>
            </CardContent>
            </Card>
        )}

        {result && (
            <Card className="shadow-lg border-neutral-300 animate-in fade-in-0 duration-500">
            <CardHeader>
                <CardTitle className="text-2xl text-neutral-950 flex items-center">
                {result.fallacies.length > 0 ? (
                    <>
                    <AlertCircle className="w-6 h-6 mr-2 text-orange-600" />
                    Analysis Complete: {result.fallacies.length} {result.fallacies.length === 1 ? 'Fallacy' : 'Fallacies'} Detected
                    </>
                ) : (
                    <>
                    <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                    Analysis Complete: No Fallacies Detected
                    </>
                )}
                </CardTitle>
                <CardDescription className="text-neutral-700">
                {result.fallacies.length > 0
                    ? "The following logical fallacies were identified in your text:"
                    : "Based on our analysis, your text appears to be free of common logical fallacies. Great reasoning!"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {result.fallacies.length > 0 ? (
                <div className="space-y-6">
                    {result.fallacies.map((fallacy, index) => (
                        <FallacyDisplay key={index} fallacy={fallacy} />
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
    </div>
  )
}
