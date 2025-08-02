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
                  text: `Generate a typography and color scheme based on the theme: "${userInput}".

Please respond with a JSON object in this exact format:
{
  "fonts": {
    "primary": "Font Name",
    "secondary": "Font Name"
  },
  "colors": ["#hexcode1", "#hexcode2", "#hexcode3", "#hexcode4", "#hexcode5"],
  "description": "Brief description of why these fonts and colors work together for this theme"
}

Requirements:
- Choose fonts that are available on Google Fonts
- Primary font should be for headings/titles
- Secondary font should be for body text/subtitles
- Provide 3-7 colors in hex format
- Colors should work harmoniously together
- Consider the mood and personality of the theme
- Description should be 1-2 sentences

Popular Google Fonts to choose from: Playfair Display, Montserrat, Open Sans, Lato, Roboto, Poppins, Inter, Merriweather, Source Sans Pro, Nunito, Raleway, Oswald, Lora, Ubuntu, Crimson Text, Work Sans, Fira Sans, PT Sans, Libre Baskerville, Quicksand, Rubik, DM Sans, Space Grotesk, Epilogue, Plus Jakarta Sans, Manrope, Outfit, Lexend.

Theme: ${userInput}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 300,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Gemini API error: ${response.status} - ${errorText}`)
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response")
    }

    const designData = JSON.parse(jsonMatch[0])

    // Validate the response structure
    if (!designData.fonts || !designData.colors || !designData.description) {
      throw new Error("Invalid response structure")
    }

    return NextResponse.json(designData)
  } catch (error) {
    console.error("Error generating design prompt:", error)

    // Fallback response
    const fallback = {
      fonts: {
        primary: "Playfair Display",
        secondary: "Inter",
      },
      colors: ["#2D3748", "#4A5568", "#718096", "#A0AEC0", "#E2E8F0"],
      description: "A classic and elegant combination with neutral tones for versatile design applications.",
    }

    return NextResponse.json(fallback)
  }
}
