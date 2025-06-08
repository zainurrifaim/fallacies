import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import fallaciesData from "../../../data/fallacies.json"

// --- Interfaces ---
interface FullFallacy {
  name: string
  description: string
  logicalForm: string
  example: string
  category: string
  altNames: string[]
  source: string
}

interface DetectedFallacy {
  name: string
  explanation: string
}

interface AnalyzedFallacy extends FullFallacy {
  explanation: string
}

// --- Caching and Data Preparation (Runs once on server start) ---

/**
 * A map for efficient lookup of fallacies by their primary name or alternative names.
 * Keys are lowercase names/altNames, values are the full fallacy objects.
 * This avoids re-processing the JSON file on every API request.
 */
const fallacyMap = new Map<string, FullFallacy>()
fallaciesData.forEach((fallacy: FullFallacy) => {
  // Ensure fallacy is a valid object before processing
  if (fallacy && fallacy.name) {
    fallacyMap.set(fallacy.name.toLowerCase(), fallacy)
    if (fallacy.altNames && Array.isArray(fallacy.altNames)) {
        fallacy.altNames.forEach((altName) => {
            fallacyMap.set(altName.toLowerCase(), fallacy)
        })
    }
  }
})

// --- Helper Functions ---

/**
 * Builds a few-shot prompt for the Groq API to improve accuracy.
 * @param text The user-provided text to analyze.
 * @returns A string containing the full prompt for the AI model.
 */
function buildPrompt(text: string): string {
  // Select a few diverse examples for the few-shot prompt, including Bandwagon.
  const fewShotExamples = [
    fallaciesData.find(f => f.name === "Ad Hominem"),
    fallaciesData.find(f => f.name === "Slippery Slope"),
    fallaciesData.find(f => f.name === "Bandwagon Fallacy"),
  ]

  const examplesString = fallaciesData
    .map(
      (f) =>
        `{ "name": "${f.name}", "description": "${f.description}" }`
    )
    .join(",\n")

  return `You are a world-class expert in logical reasoning and fallacy detection. Your task is to analyze user-provided text and identify any logical fallacies from a provided list.

Here is the list of fallacies you can identify:
[
${examplesString}
]

Analyze the following text for logical fallacies:
Text: "${text.trim()}"

Instructions:
1.  Carefully examine the text for any clear instances of logical fallacies from the provided list.
2.  Be precise and avoid false positives. Only identify fallacies that are strongly present in the text.
3.  Your response MUST be ONLY a valid JSON array of objects. Do not include any text, greetings, or explanations outside of the JSON array.
4.  For each fallacy you detect, create a JSON object with two fields:
    - "name": The exact, case-sensitive name of the fallacy from the list.
    - "explanation": A brief, one-sentence explanation of how the fallacy specifically appears in the provided text.
5.  If you find no fallacies, you MUST return an empty JSON array: [].

Here are some examples of how to respond:

Example 1:
Text: "You can't trust what he says about the economy; he's a failed businessman."
JSON Response:
[
  {
    "name": "Ad Hominem",
    "explanation": "The argument attacks the person's character (a 'failed businessman') instead of addressing the economic points being made."
  }
]

Example 2:
Text: "Everyone is switching to this new phone, so it must be the best one on the market."
JSON Response:
[
  {
    "name": "Bandwagon Fallacy",
    "explanation": "The argument claims the phone is the 'best' simply because of its popularity, not because of its features or quality."
  }
]

Now, provide your response for the text provided at the start of this prompt.

JSON Response:`
}


/**
 * Cleans the raw AI response to extract a valid JSON array string.
 * @param aiResponse The raw text response from the AI model.
 * @returns A string that is likely to be a parseable JSON array.
 */
function cleanAndExtractJson(aiResponse: string): string {
  // The model might sometimes wrap the JSON in markdown code blocks or add extra text.
  // This regex attempts to find the JSON array within the response.
  const jsonMatch = aiResponse.match(/\[[\s\S]*?\]/)
  if (jsonMatch && jsonMatch[0]) {
    return jsonMatch[0]
  }
  // As a fallback, return the trimmed response.
  return aiResponse.trim()
}


// --- API Route Handler ---

export async function POST(request: NextRequest) {
  try {
    // 1. Input Validation
    const body = await request.json()
    const { text } = body

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required and must be a non-empty string." }, { status: 400 })
    }

    const MAX_LENGTH = 5000;
    if (text.length > MAX_LENGTH) {
        return NextResponse.json({ error: `Text exceeds maximum length of ${MAX_LENGTH} characters.` }, { status: 413 });
    }

    // 2. API Key Check
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY environment variable not found.")
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 })
    }

    // 3. Build Prompt and Call Groq API
    const prompt = buildPrompt(text)
    const { text: aiResponse } = await generateText({
      model: groq("llama3-70b-8192"), // Using a more powerful model for better reasoning
      prompt,
      temperature: 0.1, // Lower temperature for more deterministic and factual output
    })

    // 4. Parse and Process AI Response
    let fallaciesResult: AnalyzedFallacy[] = []
    try {
      const jsonString = cleanAndExtractJson(aiResponse)
      const parsedFallacies: DetectedFallacy[] = JSON.parse(jsonString)

      if (Array.isArray(parsedFallacies)) {
        fallaciesResult = parsedFallacies
          .map((detected) => {
            if (!detected.name || !detected.explanation) return null

            // Use the efficient map for lookup
            const fullFallacy = fallacyMap.get(detected.name.toLowerCase())

            if (fullFallacy) {
              return {
                ...fullFallacy,
                explanation: detected.explanation,
              }
            }
            console.warn(`AI returned a fallacy not in our map: ${detected.name}`)
            return null
          })
          .filter((f): f is AnalyzedFallacy => Boolean(f))
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      console.error("Raw AI Response that failed parsing:", aiResponse)
      // Return an empty array on parsing failure to avoid crashing the client
      fallaciesResult = []
    }

    // 5. Return Success Response
    return NextResponse.json({
      fallacies: fallaciesResult,
      debug: process.env.NODE_ENV === "development" ? { rawResponse: aiResponse } : undefined,
    })
    
  } catch (error) {
    // 6. Global Error Handling
    console.error("Error in /api/analyze:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
    return NextResponse.json(
      {
        error: "Failed to analyze text.",
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
