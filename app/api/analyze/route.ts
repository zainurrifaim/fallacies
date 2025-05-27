import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import fallaciesData from "../../../data/fallacies.json"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY not found")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    const fallaciesString = fallaciesData.map((f) => `- ${f.name}: ${f.description}`).join("\n")

    const prompt = `You are an expert in logical reasoning and fallacy detection. Analyze the given text for logical fallacies.

Available fallacies:
${fallaciesString}

Text to analyze: "${text.trim()}"

Instructions:
1. Carefully examine the text for any logical fallacies
2. Only identify fallacies that are clearly present
3. Be precise and avoid false positives
4. Respond with ONLY a JSON array

For each detected fallacy, use this format:
{"name": "exact fallacy name from list", "explanation": "how this appears in the text"}

If no fallacies found, respond with: []

JSON Response:`

    const { text: aiResponse } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt,
      temperature: 0.1,
    })

    let fallaciesResult = []

    try {
      // Clean the response and extract JSON
      const cleanResponse = aiResponse.trim()
      let jsonString = cleanResponse

      // Try to extract JSON array if wrapped in other text
      const jsonMatch = cleanResponse.match(/\[[\s\S]*?\]/)
      if (jsonMatch) {
        jsonString = jsonMatch[0]
      }

      const parsedFallacies = JSON.parse(jsonString)

      if (Array.isArray(parsedFallacies)) {
        // Enrich with full data from database
        fallaciesResult = parsedFallacies
          .map((detected: any) => {
            if (!detected.name) return null

            const fullFallacy = fallaciesData.find(
              (f) =>
                f.name.toLowerCase() === detected.name.toLowerCase() ||
                f.altNames.some((alt) => alt.toLowerCase() === detected.name.toLowerCase()),
            )

            if (fullFallacy) {
              return {
                name: fullFallacy.name,
                description: fullFallacy.description,
                logicalForm: fullFallacy.logicalForm,
                example: fullFallacy.example,
                category: fullFallacy.category,
                explanation: detected.explanation || "This fallacy was detected in your text.",
              }
            }
            return null
          })
          .filter(Boolean)
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      console.error("AI Response:", aiResponse)
      // Return empty array if parsing fails
      fallaciesResult = []
    }

    return NextResponse.json({
      fallacies: fallaciesResult,
      debug: process.env.NODE_ENV === "development" ? { rawResponse: aiResponse } : undefined,
    })
  } catch (error) {
    console.error("Error in analyze API:", error)

    // Return proper JSON error response
    return NextResponse.json(
      {
        error: "Failed to analyze text",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        fallacies: [], // Always include fallacies array
      },
      { status: 500 },
    )
  }
}
