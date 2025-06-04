import { type NextRequest, NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import fallaciesData from "../../../data/fallacies.json"

// Define interfaces
interface DetectedFallacy {
  name: string
  explanation?: string
}

interface FullFallacy {
  name: string
  description: string
  logicalForm: string
  example: string
  category: string
  altNames: string[]
}

interface AnalyzedFallacy extends FullFallacy {
  explanation: string
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY not found")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    const fallaciesString = fallaciesData.map((f: FullFallacy) => `- ${f.name}: ${f.description}`).join("\n")

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

<<<<<<< HEAD
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
=======
    const { text: aiResponse } = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt,
      temperature: 0.1,
>>>>>>> parent of e60befc (major revision)
    })

    let fallaciesResult: AnalyzedFallacy[] = []

    try {
      const cleanResponse = aiResponse.trim()
      const jsonMatch = cleanResponse.match(/\[[\s\S]*?\]/)
      const jsonString = jsonMatch ? jsonMatch[0] : cleanResponse

      const parsedFallacies: DetectedFallacy[] = JSON.parse(jsonString)

      if (Array.isArray(parsedFallacies)) {
        fallaciesResult = parsedFallacies
          .map((detected) => {
            if (!detected.name) return null

            const fullFallacy = fallaciesData.find(
              (f: FullFallacy) =>
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
                altNames: fullFallacy.altNames,
                explanation: detected.explanation || "This fallacy was detected in your text.",
              }
            }

            return null
          })
          .filter((f): f is NonNullable<typeof f> => Boolean(f))
      }
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      console.error("AI Response:", aiResponse)
      fallaciesResult = []
    }

    return NextResponse.json({
      fallacies: fallaciesResult,
      debug: process.env.NODE_ENV === "development" ? { rawResponse: aiResponse } : undefined,
    })
  } catch (error) {
    console.error("Error in analyze API:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze text",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        fallacies: [],
      },
      { status: 500 },
    )
  }
}
