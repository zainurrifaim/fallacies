import type React from "react"
export interface AnalysisRequest {
  context: string
  studentAnswer: string
}

export interface Misconception {
  description: string
  category:
    | "Preconceived Notions"
    | "Nonscientific Beliefs"
    | "Conceptual Misunderstandings"
    | "Vernacular Misconceptions"
    | "Factual Misconceptions"
  explanation: string
  confidence: number
  prevalence: "rare" | "occasional" | "common" | "pervasive"
  persistence: "low" | "moderate" | "high" | "extreme"
  complexity: "simple" | "moderate" | "complex" | "multidimensional"
  examples_from_framework?: string[]
  cognitive_origins?: string[]
}

export interface TeachingSuggestion {
  strategy: string
  category_targeted: string
  implementation: string
  duration?: string
  success_rate?: string
}

export interface FrameworkAnalysis {
  primaryCategory: string
  interventionPriority: "Critical" | "High" | "Medium" | "Low"
  recommendedApproach: string
}

export interface AnalysisResponse {
  misconceptions: Misconception[]
  correctConcepts: string[]
  teachingSuggestions: TeachingSuggestion[]
  overallConfidence: number
  frameworkAnalysis?: FrameworkAnalysis
}

export interface ComponentProps {
  className?: string
  children?: React.ReactNode
}
