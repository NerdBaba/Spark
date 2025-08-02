// FontFaceObserver polyfill for dynamic font loading
export class FontFaceObserver {
  private family: string

  constructor(family: string) {
    this.family = family
  }

  load(timeout = 3000): Promise<void> {
    return new Promise((resolve, reject) => {
      const testString = "BESbswy"
      const testSize = "100px"
      const fallbackFont = "monospace"

      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")!

      // Measure fallback font
      context.font = `${testSize} ${fallbackFont}`
      const fallbackWidth = context.measureText(testString).width

      // Function to check if font is loaded
      const checkFont = () => {
        context.font = `${testSize} ${this.family}, ${fallbackFont}`
        const currentWidth = context.measureText(testString).width
        return currentWidth !== fallbackWidth
      }

      // Check immediately
      if (checkFont()) {
        resolve()
        return
      }

      // Poll for font loading
      const startTime = Date.now()
      const interval = setInterval(() => {
        if (checkFont()) {
          clearInterval(interval)
          resolve()
        } else if (Date.now() - startTime > timeout) {
          clearInterval(interval)
          resolve() // Resolve anyway to prevent hanging
        }
      }, 100)
    })
  }
}
