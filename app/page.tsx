"use client"

import { useState } from "react"
import { Copy, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FontFaceObserver } from "@/lib/font-observer"

const subjects = [
  "A forgotten god",
  "An ancient robot",
  "A lonely ghost",
  "A time-traveling chef",
  "A dream merchant",
  "A library that breathes",
  "A clockmaker's apprentice",
  "A shadow with amnesia",
  "A singing mountain",
  "A detective made of smoke",
  "A garden that remembers",
  "A lighthouse keeper's diary",
  "A mirror that lies",
  "A storm collector",
  "A painter of silence",
  "A door that leads nowhere",
  "A memory thief",
  "A constellation's last wish",
  "A broken compass",
  "A storyteller's echo",
]

const scenarios = [
  "running a coffee shop",
  "afraid of the dark",
  "in a vending machine",
  "learning to dance",
  "writing love letters",
  "hiding in plain sight",
  "teaching children to fly",
  "collecting lost things",
  "building paper airplanes",
  "whispering to plants",
  "painting with starlight",
  "solving impossible puzzles",
  "baking bread at midnight",
  "reading minds reluctantly",
  "fixing broken hearts",
  "translating bird songs",
  "weaving dreams together",
  "counting backwards from infinity",
  "dancing with their shadow",
  "searching for the perfect word",
]

type Category = "character" | "technical" | "design"

interface DesignPrompt {
  fonts: {
    primary: string
    secondary: string
  }
  colors: string[]
  description: string
}

export default function SparkApp() {
  const [activeCategory, setActiveCategory] = useState<Category>("character")
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [designPrompt, setDesignPrompt] = useState<DesignPrompt | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isInitial, setIsInitial] = useState(true)
  const [userInput, setUserInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateCharacterPrompt = () => {
    setIsAnimating(true)
    setIsInitial(false)

    setTimeout(() => {
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)]
      setCurrentPrompt(`${randomSubject} ${randomScenario}`)
      setIsAnimating(false)
    }, 200)
  }

  const generateTechnicalPrompt = async () => {
    if (!userInput.trim()) return

    setIsGenerating(true)
    setIsAnimating(true)
    setIsInitial(false)

    try {
      const response = await fetch("/api/generate-tech-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: userInput.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate prompt")
      }

      const data = await response.json()

      setTimeout(() => {
        setCurrentPrompt(data.prompt)
        setIsAnimating(false)
        setIsGenerating(false)
      }, 200)
    } catch (error) {
      console.error("Error generating technical prompt:", error)
      setTimeout(() => {
        setCurrentPrompt("Error generating prompt. Please try again.")
        setIsAnimating(false)
        setIsGenerating(false)
      }, 200)
    }
  }

  const generateDesignPrompt = async () => {
    if (!userInput.trim()) return

    setIsGenerating(true)
    setIsAnimating(true)
    setIsInitial(false)

    try {
      const response = await fetch("/api/generate-design-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput: userInput.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate design prompt")
      }

      const data = await response.json()

      // Load Google Fonts dynamically
      await loadGoogleFonts([data.fonts.primary, data.fonts.secondary])

      setTimeout(() => {
        setDesignPrompt(data)
        setIsAnimating(false)
        setIsGenerating(false)
      }, 200)
    } catch (error) {
      console.error("Error generating design prompt:", error)
      setTimeout(() => {
        setCurrentPrompt("Error generating design prompt. Please try again.")
        setIsAnimating(false)
        setIsGenerating(false)
      }, 200)
    }
  }

  const loadGoogleFonts = async (fonts: string[]) => {
    const fontPromises = fonts.map(async (font) => {
      const fontName = font.replace(/\s+/g, "+")
      const link = document.createElement("link")
      link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700&display=swap`
      link.rel = "stylesheet"
      document.head.appendChild(link)

      // Wait for font to load
      return new Promise((resolve) => {
        const observer = new FontFaceObserver(font)
        observer.load().then(resolve).catch(resolve)
      })
    })

    await Promise.all(fontPromises)
  }

  const copyToClipboard = async () => {
    let textToCopy = ""

    if (activeCategory === "design" && designPrompt) {
      textToCopy = `Fonts: ${designPrompt.fonts.primary} + ${designPrompt.fonts.secondary}\nColors: ${designPrompt.colors.join(", ")}\nDescription: ${designPrompt.description}`
    } else if (currentPrompt) {
      textToCopy = currentPrompt
    }

    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const switchCategory = (category: Category) => {
    setActiveCategory(category)
    setCurrentPrompt("")
    setDesignPrompt(null)
    setIsInitial(true)
    setUserInput("")
  }

  const handleGenerate = () => {
    switch (activeCategory) {
      case "character":
        generateCharacterPrompt()
        break
      case "technical":
        generateTechnicalPrompt()
        break
      case "design":
        generateDesignPrompt()
        break
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: "#F8F4E9" }}>
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto text-center">
        {/* App Title */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-black mb-4 font-serif">Spark</h1>
          <p className="text-lg text-black/60 font-light">The creative prompt generator</p>
        </div>

        {/* Category Tabs */}
        <div className="mb-16 flex gap-1 p-1 bg-black/5 rounded-full">
          <button
            onClick={() => switchCategory("character")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === "character" ? "bg-black text-white" : "text-black/60 hover:text-black"
            }`}
          >
            Character
          </button>
          <button
            onClick={() => switchCategory("technical")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === "technical" ? "bg-black text-white" : "text-black/60 hover:text-black"
            }`}
          >
            Technical
          </button>
          <button
            onClick={() => switchCategory("design")}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === "design" ? "bg-black text-white" : "text-black/60 hover:text-black"
            }`}
          >
            Design
          </button>
        </div>

        {/* Input Field for Technical and Design */}
        {(activeCategory === "technical" || activeCategory === "design") && (
          <div className="mb-8 w-full max-w-md">
            <Input
              type="text"
              placeholder={
                activeCategory === "technical"
                  ? "Enter your interest (e.g., fitness, cooking...)"
                  : "Enter design theme (e.g., luxury spa, tech startup...)"
              }
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="text-center text-lg py-6 border-black/20 focus:border-black bg-white/50"
            />
          </div>
        )}

        {/* Prompt Display */}
        <div className="mb-20 min-h-[200px] flex items-center justify-center relative">
          {isInitial ? (
            <p className="text-2xl text-black/40 font-light italic">
              {activeCategory === "character" && "Press the button for your creative spark"}
              {activeCategory === "technical" && "Enter your interest and generate a technical prompt"}
              {activeCategory === "design" && "Enter a design theme and generate typography & colors"}
            </p>
          ) : (
            <div className="relative max-w-5xl w-full">
              {/* Character and Technical Prompts */}
              {activeCategory !== "design" && (
                <p
                  className={`text-3xl font-bold text-black leading-relaxed transition-opacity duration-200 ${
                    isAnimating ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {currentPrompt}
                </p>
              )}

              {/* Design Prompt Display */}
              {activeCategory === "design" && designPrompt && (
                <div className={`transition-opacity duration-200 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
                  {/* Typography Preview */}
                  <div className="mb-8">
                    <h3 className="text-lg text-black/60 mb-4">Typography Pair</h3>
                    <div className="space-y-4">
                      <div className="text-4xl font-bold text-black" style={{ fontFamily: designPrompt.fonts.primary }}>
                        {designPrompt.fonts.primary}
                      </div>
                      <div className="text-2xl text-black/80" style={{ fontFamily: designPrompt.fonts.secondary }}>
                        {designPrompt.fonts.secondary}
                      </div>
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="mb-8">
                    <h3 className="text-lg text-black/60 mb-4">Color Palette</h3>
                    <div className="flex justify-center gap-3 flex-wrap">
                      {designPrompt.colors.map((color, index) => (
                        <div key={index} className="text-center">
                          <div className="w-16 h-16 rounded-lg shadow-md mb-2" style={{ backgroundColor: color }} />
                          <div className="text-xs text-black/60 font-mono">{color}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="text-lg text-black/80 leading-relaxed max-w-2xl mx-auto">
                    {designPrompt.description}
                  </div>
                </div>
              )}

              {/* Copy Button */}
              {((currentPrompt && activeCategory !== "design") || (designPrompt && activeCategory === "design")) &&
                !isAnimating && (
                  <button
                    onClick={copyToClipboard}
                    className="relative mt-4 ml-auto p-2 text-black/40 hover:text-black transition-colors duration-200 md:absolute md:-right-12 md:top-4"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={
          isAnimating ||
          isGenerating ||
          ((activeCategory === "technical" || activeCategory === "design") && !userInput.trim())
        }
        className="bg-black text-white hover:bg-black/90 px-12 py-6 text-xl font-medium rounded-full transition-all duration-200 active:scale-95 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>{isInitial ? "Spark" : "New Spark"}</>
        )}
      </Button>

      {/* Subtle Footer */}
      <div className="mt-12 text-xs text-black/30 font-light">
        {activeCategory === "character" && "One button. Infinite possibilities."}
        {activeCategory === "technical" && "AI-powered technical creativity."}
        {activeCategory === "design" && "Typography & color harmony."}
      </div>
    </div>
  )
}
