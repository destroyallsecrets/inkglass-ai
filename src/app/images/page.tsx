'use client'

import React, { useState, useRef } from 'react'
import { Sidebar } from '@/components/layout'
import { Container } from '@/components/layout'
import { Header, Page } from '@/components/layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Alert,
} from '@/components/ui'
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  RefreshCw,
  Save,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Link as LinkIcon,
  Eye,
  Palette,
  Info,
  Maximize2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  analyzeImage,
  formatImageSize,
  getImageCategory,
  rgbToHex,
  type ImageAnalysis,
} from '@/lib/images'

export default function ImagesPage() {
  const [image, setImage] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showDocs, setShowDocs] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState('')

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setImageName(file.name)
        setImageFile(file)
        setAnalysis(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleUrlSubmit = () => {
    if (imageUrl) {
      setImage(imageUrl)
      setImageName(imageUrl.split('/').pop() || 'image')
      setImageFile(null)
      setAnalysis(null)
    }
  }

  const handleAnalyze = async () => {
    if (!imageFile && !image) return
    setIsProcessing(true)
    
    try {
      if (imageFile) {
        const result = await analyzeImage(imageFile)
        setAnalysis(result)
      } else if (image) {
        const response = await fetch(image)
        const blob = await response.blob()
        const file = new File([blob], 'image.jpg', { type: blob.type })
        const result = await analyzeImage(file)
        setAnalysis(result)
      }
    } catch (error) {
      console.error('Analysis error:', error)
    }
    
    setIsProcessing(false)
  }

  const handleCopy = async () => {
    if (!analysis) return
    const text = `Image Analysis:
- Dimensions: ${analysis.width}x${analysis.height}
- Aspect Ratio: ${analysis.aspectRatio}
- Format: ${analysis.format}
- Size: ${formatImageSize(analysis.size)}
- Category: ${getImageCategory(analysis.brightness, analysis.contrast)}
- Dominant Color: ${rgbToHex(analysis.dominantColor)}
- Brightness: ${analysis.brightness}
- Contrast: ${analysis.contrast}
- Color Palette: ${analysis.colorPalette.map(rgbToHex).join(', ')}`
    
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setImage(null)
    setImageName('')
    setImageFile(null)
    setAnalysis(null)
    setImageUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container className="max-w-6xl">
          <Header
            title="Image Analysis"
            subtitle="Analyze images for colors, dimensions, and properties"
            actions={
              <Button variant="secondary" onClick={() => setShowDocs(!showDocs)}>
                <HelpCircle className="w-4 h-4 mr-2" />
                {showDocs ? 'Hide Docs' : 'Show Docs'}
              </Button>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={cn("space-y-6", showDocs ? "lg:col-span-2" : "lg:col-span-3")}>
              <Card variant="paper" padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Upload Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!image ? (
                      <>
                        <div
                          onDrop={handleDrop}
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                          onDragLeave={() => setIsDragging(false)}
                          className={cn(
                            "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
                            isDragging 
                              ? "border-ink-black bg-ink-light/10" 
                              : "border-ink-light/30 hover:border-ink-light"
                          )}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="w-12 h-12 mx-auto text-ink-gray mb-4" />
                          <p className="text-ink-gray mb-4">
                            Drag and drop an image here, or click to browse
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                          <Button variant="secondary">
                            Browse Files
                          </Button>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-ink-light/30" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-ink-paper text-ink-gray">or paste URL</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="flex-1 px-4 py-2 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
                          />
                          <Button onClick={handleUrlSubmit} disabled={!imageUrl}>
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Load
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative rounded-lg overflow-hidden bg-ink-light/10">
                          <img
                            src={image}
                            alt="Uploaded"
                            className="w-full max-h-96 object-contain mx-auto"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 bg-ink-paper/80"
                            onClick={handleReset}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-ink-gray text-center">{imageName}</p>

                        <Button 
                          className="w-full" 
                          onClick={handleAnalyze} 
                          isLoading={isProcessing}
                          disabled={!image}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Analyze Image
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {analysis && (
                <Card variant="glass" padding="lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Image Analysis
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={handleCopy}>
                        {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-ink-light/10 rounded-lg text-center">
                          <Maximize2 className="w-5 h-5 mx-auto text-ink-gray mb-2" />
                          <p className="text-xs text-ink-gray">Dimensions</p>
                          <p className="font-bold">{analysis.width} x {analysis.height}</p>
                        </div>
                        <div className="p-4 bg-ink-light/10 rounded-lg text-center">
                          <Info className="w-5 h-5 mx-auto text-ink-gray mb-2" />
                          <p className="text-xs text-ink-gray">Aspect Ratio</p>
                          <p className="font-bold">{analysis.aspectRatio}</p>
                        </div>
                        <div className="p-4 bg-ink-light/10 rounded-lg text-center">
                          <ImageIcon className="w-5 h-5 mx-auto text-ink-gray mb-2" />
                          <p className="text-xs text-ink-gray">Format</p>
                          <p className="font-bold uppercase">{analysis.format}</p>
                        </div>
                        <div className="p-4 bg-ink-light/10 rounded-lg text-center">
                          <Info className="w-5 h-5 mx-auto text-ink-gray mb-2" />
                          <p className="text-xs text-ink-gray">Size</p>
                          <p className="font-bold">{formatImageSize(analysis.size)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-ink-light/10 rounded-lg">
                          <p className="text-xs text-ink-gray mb-2">Dominant Color</p>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg border border-ink-light/30" 
                              style={{ backgroundColor: rgbToHex(analysis.dominantColor) }}
                            />
                            <div>
                              <p className="font-bold">{rgbToHex(analysis.dominantColor)}</p>
                              <p className="text-xs text-ink-gray">{getImageCategory(analysis.brightness, analysis.contrast)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-ink-light/10 rounded-lg">
                          <p className="text-xs text-ink-gray mb-2">Brightness</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-ink-light/30 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-ink-black rounded-full"
                                style={{ width: `${(analysis.brightness / 255) * 100}%` }}
                              />
                            </div>
                            <p className="font-bold w-12 text-right">{analysis.brightness}</p>
                          </div>
                        </div>
                        <div className="p-4 bg-ink-light/10 rounded-lg">
                          <p className="text-xs text-ink-gray mb-2">Contrast</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-ink-light/30 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-ink-black rounded-full"
                                style={{ width: `${(analysis.contrast / 255) * 100}%` }}
                              />
                            </div>
                            <p className="font-bold w-12 text-right">{analysis.contrast}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Palette className="w-5 h-5 text-ink-gray" />
                          <p className="text-sm font-medium">Color Palette</p>
                        </div>
                        <div className="flex gap-2">
                          {analysis.colorPalette.map((color, i) => (
                            <div 
                              key={i}
                              className="flex flex-col items-center gap-1"
                            >
                              <div 
                                className="w-12 h-12 rounded-lg border border-ink-light/30" 
                                style={{ backgroundColor: rgbToHex(color) }}
                                title={rgbToHex(color)}
                              />
                              <span className="text-xs text-ink-gray">{rgbToHex(color)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {showDocs && (
              <div className="space-y-6">
                <Card variant="ink" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Lightbulb className="w-5 h-5" />
                      How It Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-ink-light">
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Upload or paste an image URL</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Click Analyze to process</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>View dimensions, colors, and properties</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Copy results to clipboard</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="w-5 h-5" />
                      Analysis Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Maximize2 className="w-4 h-4 mt-1 text-ink-gray" />
                        <div>
                          <span className="font-medium">Dimensions</span>
                          <p className="text-xs text-ink-gray">Width and height in pixels</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Palette className="w-4 h-4 mt-1 text-ink-gray" />
                        <div>
                          <span className="font-medium">Color Analysis</span>
                          <p className="text-xs text-ink-gray">Extract dominant colors and palette</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Info className="w-4 h-4 mt-1 text-ink-gray" />
                        <div>
                          <span className="font-medium">Image Properties</span>
                          <p className="text-xs text-ink-gray">Format, size, brightness, contrast</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      Supported Formats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {['JPG', 'PNG', 'GIF', 'WEBP', 'BMP'].map((format) => (
                        <span key={format} className="px-2 py-1 text-xs bg-ink-light/10 rounded-full text-ink-gray">
                          {format}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-ink-gray mt-3">Max file size: 10MB</p>
                  </CardContent>
                </Card>

                <Alert title="Client-Side Processing" intent="info">
                  <p className="text-sm text-ink-light mt-1">
                    All image analysis is done in your browser. No data is sent to external servers.
                  </p>
                </Alert>
              </div>
            )}
          </div>
        </Container>
      </Page>
    </div>
  )
}
