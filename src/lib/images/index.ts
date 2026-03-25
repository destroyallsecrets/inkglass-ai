export interface ImageAnalysis {
  width: number
  height: number
  aspectRatio: string
  format: string
  size: number
  colorPalette: string[]
  dominantColor: string
  brightness: number
  contrast: number
}

export interface ImageInfo {
  name: string
  type: string
  size: number
  analysis?: ImageAnalysis
}

export async function analyzeImage(file: File): Promise<ImageAnalysis> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const colors = extractColorPalette(imageData)
      const dominantColor = colors[0]
      const brightness = calculateBrightness(imageData)
      const contrast = calculateContrast(imageData)

      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: calculateAspectRatio(img.width, img.height),
        format: file.type.split('/')[1] || 'unknown',
        size: file.size,
        colorPalette: colors.slice(0, 5),
        dominantColor,
        brightness,
        contrast,
      })
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

function extractColorPalette(imageData: ImageData): string[] {
  const pixels = imageData.data
  const colorCounts: Record<string, number> = {}

  for (let i = 0; i < pixels.length; i += 40) {
    const r = Math.round(pixels[i] / 32) * 32
    const g = Math.round(pixels[i + 1] / 32) * 32
    const b = Math.round(pixels[i + 2] / 32) * 32
    const color = `rgb(${r}, ${g}, ${b})`
    colorCounts[color] = (colorCounts[color] || 0) + 1
  }

  return Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color)
}

function calculateBrightness(imageData: ImageData): number {
  const pixels = imageData.data
  let totalBrightness = 0
  const pixelCount = pixels.length / 4

  for (let i = 0; i < pixels.length; i += 4) {
    const brightness = (pixels[i] * 299 + pixels[i + 1] * 587 + pixels[i + 2] * 114) / 1000
    totalBrightness += brightness
  }

  return Math.round(totalBrightness / pixelCount)
}

function calculateContrast(imageData: ImageData): number {
  const pixels = imageData.data
  let min = 255
  let max = 0

  for (let i = 0; i < pixels.length; i += 4) {
    const brightness = (pixels[i] * 299 + pixels[i + 1] * 587 + pixels[i + 2] * 114) / 1000
    min = Math.min(min, brightness)
    max = Math.max(max, brightness)
  }

  return max - min
}

function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
  const divisor = gcd(width, height)
  return `${width / divisor}:${height / divisor}`
}

export function formatImageSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export function getImageCategory(brightness: number, contrast: number): string {
  if (brightness > 180) return 'Bright'
  if (brightness < 80) return 'Dark'
  if (contrast > 150) return 'High Contrast'
  if (contrast < 50) return 'Low Contrast'
  return 'Balanced'
}

export function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (!match) return rgb
  
  const r = parseInt(match[1]).toString(16).padStart(2, '0')
  const g = parseInt(match[2]).toString(16).padStart(2, '0')
  const b = parseInt(match[3]).toString(16).padStart(2, '0')
  
  return `#${r}${g}${b}`
}
