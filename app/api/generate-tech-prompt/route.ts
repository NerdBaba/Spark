import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userInput } = await request.json()

    if (!userInput) {
      return NextResponse.json({ error: "User input is required" }, { status: 400 })
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a creative and innovative technical application idea based on the user's interest: "${userInput}". 

The response should be:
- A single, compelling app/software concept
- 1-2 sentences maximum
- Focus on unique features or novel approaches
- Make it specific and actionable
- Avoid generic ideas

Examples:
- For "fitness": "A mirror app that uses AI to analyze your workout form in real-time and suggests micro-corrections through haptic feedback in smart clothing"
- For "cooking": "An AR app that overlays cooking instructions directly onto your ingredients, adjusting recipes based on what's actually in your fridge using computer vision"

Generate one creative technical prompt for: ${userInput}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 150,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const prompt = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate prompt"

    return NextResponse.json({ prompt })
  } catch (error) {
    console.error("Error generating technical prompt:", error)
    return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 })
  }
}
