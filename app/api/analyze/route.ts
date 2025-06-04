import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"
import type { AnalysisRequest, AnalysisResponse } from "@/types"
import misconceptionFramework from "@/data/misconception-framework.json"

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json()
    const { context, studentAnswer } = body

    if (!context || !studentAnswer) {
      return NextResponse.json(
        { error: "Context and student answer are required" }, 
        { status: 400 }
      )
    }

    // Initialize Groq client
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set")
    }

    const groq = new Groq({ apiKey })

    const prompt = `You are an expert science education analyst using a research-based misconception framework. Analyze the following student response using ONLY the provided misconception categories and treatment strategies from the database.

## MISCONCEPTION FRAMEWORK DATABASE

### MISCONCEPTION CATEGORIES:
${JSON.stringify(misconceptionFramework.misconception_categories, null, 2)}

### TREATMENT STRATEGIES:
${JSON.stringify(misconceptionFramework.treatment_strategies, null, 2)}

## ANALYSIS TASK

**Context:** ${context}
**Student Answer:** ${studentAnswer}

## INSTRUCTIONS

<<<<<<< HEAD
1. **IDENTIFY MISCONCEPTIONS**: Examine the student response for any misconceptions
=======
1. **IDENTIFY MISCONCEPTIONS**: Examine students response for any misconceptions
>>>>>>> 503e31c310f7ede2ab549302f74d6ed8aa9b48ee
2. **CLASSIFY USING DATABASE**: Map each misconception to ONE of the five framework categories
3. **SELECT APPROPRIATE STRATEGIES**: Choose treatment strategies from the database that match the identified misconceptions
4. **PROVIDE EVIDENCE**: Reference specific examples from the framework database to support your analysis

## REQUIRED JSON OUTPUT FORMAT

\`\`\`json
{
  "misconceptions": [
    {
      "description": "Brief description of the misconception found in student response",
      "category": "Must be exactly one of: Preconceived Notions, Nonscientific Beliefs, Conceptual Misunderstandings, Vernacular Misconceptions, or Factual Misconceptions",
      "explanation": "Detailed explanation of why this fits the chosen category, referencing the database description",
      "related_framework_examples": ["List examples from the database that are similar to this misconception"]
    }
  ],
  "correctConcepts": [
    "List correct scientific concepts the student demonstrates"
  ],
  "teachingSuggestions": [
    {
      "strategy": "Must be exactly one of: Conceptual Change Texts, Bridging Analogies, Refutational Texts, Inquiry-Based Learning, or Discussion and Argumentation",
      "rationale": "Why this strategy from the database is appropriate for the identified misconception category",
      "implementation": "Specific implementation steps based on the database description, customized for this student's misconceptions",
      "expected_duration": "Duration estimate from database",
      "expected_success_rate": "Success rate from database"
    }
  ],
  "frameworkAnalysis": {
    "primaryCategory": "The most prominent misconception category from the database",
    "interventionPriority": "Critical/High/Medium/Low based on misconception severity",
    "recommendedApproach": "The most suitable strategy from the database for this case"
  }
}
\`\`\`

## DATABASE REFERENCE REQUIREMENTS

### Misconception Categories (use EXACTLY these):
- **Preconceived Notions**: ${misconceptionFramework.misconception_categories[0].description}
- **Nonscientific Beliefs**: ${misconceptionFramework.misconception_categories[1].description}
- **Conceptual Misunderstandings**: ${misconceptionFramework.misconception_categories[2].description}
- **Vernacular Misconceptions**: ${misconceptionFramework.misconception_categories[3].description}
- **Factual Misconceptions**: ${misconceptionFramework.misconception_categories[4].description}

### Treatment Strategies (use EXACTLY these):
- **Conceptual Change Texts**: ${misconceptionFramework.treatment_strategies[0].description}
- **Bridging Analogies**: ${misconceptionFramework.treatment_strategies[1].description}
- **Refutational Texts**: ${misconceptionFramework.treatment_strategies[2].description}
- **Inquiry-Based Learning**: ${misconceptionFramework.treatment_strategies[3].description}
- **Discussion and Argumentation**: ${misconceptionFramework.treatment_strategies[4].description}

## ANALYSIS RULES

1. **STRICT DATABASE COMPLIANCE**: Use only categories and strategies that exist in the provided database
2. **EVIDENCE-BASED**: Reference specific examples from the database when making classifications
3. **NO EXTERNAL VARIABLES**: Do not add assessment metrics not present in the database
4. **FRAMEWORK FIDELITY**: Base all analysis on the database descriptions and examples
5. **SCIENTIFIC ACCURACY**: Ensure all recommendations align with the research-based framework provided

If no misconceptions are found, provide an empty misconceptions array and focus on the correct concepts demonstrated.

Base your entire analysis strictly on the provided database content. Do not invent or add assessment criteria beyond what exists in the framework.`

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.3,
      max_tokens: 2000,
    })

    if (!completion?.choices?.[0]?.message?.content) {
      throw new Error("Invalid or empty response from Groq API")
    }

    const responseText = completion.choices[0].message.content

    // Enhanced JSON parsing with database validation
    let analysisResult: AnalysisResponse
    try {
      let jsonText = responseText.trim()
      
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/```json\s*/, '').replace(/```\s*$/, '')
      
      // Look for JSON object in the response
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonText = jsonMatch[0]
      }
      
      const parsedResponse = JSON.parse(jsonText)
      
      // Validate response structure with database compliance
      const isValidAnalysisResponse = (response: unknown): response is AnalysisResponse => {
        const r = response as AnalysisResponse
        
        // Valid categories from database
        const validCategories = misconceptionFramework.misconception_categories.map(cat => cat.category)
        
        // Valid strategies from database
        const validStrategies = misconceptionFramework.treatment_strategies.map(strategy => strategy.strategy)
        
        // Validate misconceptions
        const validMisconceptions = Array.isArray(r.misconceptions) && 
          r.misconceptions.every((m: any) => 
            validCategories.includes(m.category) && 
            typeof m.description === 'string' &&
            typeof m.explanation === 'string'
          )
        
        // Validate teaching suggestions
        const validTeachingSuggestions = Array.isArray(r.teachingSuggestions) && 
          r.teachingSuggestions.every((t: any) => 
            validStrategies.includes(t.strategy) &&
            typeof t.rationale === 'string' &&
            typeof t.implementation === 'string'
          )
        
        return (
          typeof r === 'object' &&
          r !== null &&
          validMisconceptions &&
          Array.isArray(r.correctConcepts) &&
          validTeachingSuggestions &&
          typeof r.frameworkAnalysis === 'object'
        )
      }

      if (!isValidAnalysisResponse(parsedResponse)) {
        throw new Error("Response does not match expected structure or contains invalid database references")
      }

      // Ensure required fields exist with database-compliant defaults
      analysisResult = {
        misconceptions: parsedResponse.misconceptions || [],
        correctConcepts: parsedResponse.correctConcepts || [],
        teachingSuggestions: parsedResponse.teachingSuggestions || [],
        overallConfidence: typeof parsedResponse.overallConfidence === "number" ? parsedResponse.overallConfidence : 0.8,
        frameworkAnalysis: parsedResponse.frameworkAnalysis || {
          primaryCategory: "Unknown",
          interventionPriority: "Medium",
          recommendedApproach: "Multi-strategy approach"
        }
      }
      
    } catch (parseError) {
      console.error("Failed to parse or validate Groq response:", responseText)
      
      // Provide more specific error details
      const errorDetails = parseError instanceof Error ? parseError.message : "Unknown parsing error"
      const isJsonError = errorDetails.includes("JSON") || errorDetails.includes("parse")
      
      return NextResponse.json(
        { 
          error: isJsonError 
            ? "The AI response was not in the expected format. This can happen with complex analyses."
            : "Invalid response structure from AI model or non-compliant database references",
          details: errorDetails,
          receivedResponse: responseText.substring(0, 500) + (responseText.length > 500 ? "..." : "")
        },
        { status: 422 }
      )
    }

    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error("Analysis error:", error)

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('429') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        )
      }
      
      if (error.message.includes('API key') || error.message.includes('401')) {
        return NextResponse.json(
          { error: "Authentication failed" },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: `Analysis failed: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "An unexpected error occurred during analysis" },
      { status: 500 }
    )
  }
}