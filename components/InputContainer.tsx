"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Send, RotateCcw } from "lucide-react"
import type { AnalysisRequest } from "@/types"

interface InputContainerProps {
  onAnalyze: (data: AnalysisRequest) => void
  isLoading: boolean
  onClear: () => void
}

export default function InputContainer({ onAnalyze, isLoading, onClear }: InputContainerProps) {
  const [context, setContext] = useState("")
  const [studentAnswer, setStudentAnswer] = useState("")
  const [errors, setErrors] = useState<{ context?: string; studentAnswer?: string }>({})

  const validateInputs = () => {
    const newErrors: { context?: string; studentAnswer?: string } = {}

    if (!context.trim()) {
      newErrors.context = "Educational context is required"
    } else if (context.trim().length < 10) {
      newErrors.context = "Context should be at least 10 characters"
    }

    if (!studentAnswer.trim()) {
      newErrors.studentAnswer = "Student answer is required"
    } else if (studentAnswer.trim().length < 5) {
      newErrors.studentAnswer = "Student answer should be at least 5 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateInputs()) {
      onAnalyze({ context: context.trim(), studentAnswer: studentAnswer.trim() })
    }
  }

  const handleClear = () => {
    setContext("")
    setStudentAnswer("")
    setErrors({})
    onClear()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="h-5 w-5 text-indigo-600" />
          <span>Analysis Input</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="context" className="text-sm font-medium">
            Educational Context
          </Label>
          <Textarea
            id="context"
            placeholder="Describe the lesson topic, grade level, and any relevant background information..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className={`min-h-[120px] resize-none ${errors.context ? "border-red-500" : ""}`}
            disabled={isLoading}
          />
          {errors.context && <p className="text-sm text-red-600">{errors.context}</p>}
          <p className="text-xs text-gray-500">{context.length}/1000 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentAnswer" className="text-sm font-medium">
            Student Answer
          </Label>
          <Textarea
            id="studentAnswer"
            placeholder="Enter the student's response to analyze for misconceptions..."
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            className={`min-h-[150px] resize-none ${errors.studentAnswer ? "border-red-500" : ""}`}
            disabled={isLoading}
          />
          {errors.studentAnswer && <p className="text-sm text-red-600">{errors.studentAnswer}</p>}
          <p className="text-xs text-gray-500">{studentAnswer.length}/2000 characters</p>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !context.trim() || !studentAnswer.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Analyze Misconceptions
              </>
            )}
          </Button>

          <Button variant="outline" onClick={handleClear} disabled={isLoading}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
