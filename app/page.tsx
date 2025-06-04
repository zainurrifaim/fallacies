"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import InputContainer from "@/components/InputContainer"
import OutputContainer from "@/components/OutputContainer"
import type { AnalysisRequest, AnalysisResponse } from "@/types"

interface ErrorResponse {
  error: string
  details?: string
  receivedResponse?: string
}

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRequest, setLastRequest] = useState<AnalysisRequest | null>(null)

  const handleAnalysis = async (data: AnalysisRequest) => {
    setIsLoading(true)
    setError(null)
    setAnalysisResult(null)
    setLastRequest(data)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        // Try to get the error details from the response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData: ErrorResponse = await response.json()
          
          if (errorData.error) {
            errorMessage = errorData.error
            
            // Add additional context for specific error types
            if (response.status === 422) {
              errorMessage = `Response format error: ${errorData.error}`
              
              if (errorData.details) {
                errorMessage += `\nDetails: ${errorData.details}`
              }
              
              // Log the received response for debugging (only in development)
              if (process.env.NODE_ENV === 'development' && errorData.receivedResponse) {
                console.error('Received response:', errorData.receivedResponse)
              }
            } else if (response.status === 429) {
              errorMessage = "Rate limit exceeded. Please wait a moment before trying again."
            } else if (response.status === 401) {
              errorMessage = "Authentication error. Please check the API configuration."
            }
          }
        } catch (parseError) {
          // If we can't parse the error response, use the status text
          console.error('Failed to parse error response:', parseError)
        }
        
        throw new Error(errorMessage)
      }

      const result: AnalysisResponse = await response.json()
      setAnalysisResult(result)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      console.error('Analysis error:', err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    if (lastRequest) {
      handleAnalysis(lastRequest)
    }
  }

  const handleClear = () => {
    setAnalysisResult(null)
    setError(null)
    setLastRequest(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <InputContainer 
              onAnalyze={handleAnalysis} 
              isLoading={isLoading} 
              onClear={handleClear} 
            />
          </div>

          <div className="space-y-6">
            <OutputContainer 
              result={analysisResult} 
              isLoading={isLoading} 
              error={error}
              onRetry={lastRequest ? handleRetry : undefined}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}