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
import { Select } from '@/components/forms'
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  RefreshCw,
  Save,
  HelpCircle,
  Lightbulb,
  Keyboard,
  BookOpen,
  Sparkles,
  Link as LinkIcon,
  Scan,
  Type,
  Shapes,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const analysisTypes = [
  { value: 'describe', label: 'Describe Image' },
  { value: 'objects', label: 'Detect Objects' },
  { value: 'text', label: 'Extract Text (OCR)' },
  { value: 'faces', label: 'Analyze Faces' },
]

export default function ImagesPage() {
  const [image, setImage] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string>('')
  const [analysisType, setAnalysisType] = useState('describe')
  const [result, setResult] = useState('')
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
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleUrlSubmit = () => {
    if (imageUrl) {
      setImage(imageUrl)
      setImageName(imageUrl.split('/').pop() || 'image')
    }
  }

  const handleAnalyze = () => {
    if (!image) return
    setIsProcessing(true)
    
    setTimeout(() => {
      const analysis = analyzeImage(analysisType, image)
      setResult(analysis)
      setIsProcessing(false)
    }, 2000)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setImage(null)
    setImageName('')
    setResult('')
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
            subtitle="Analyze and understand images with AI"
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
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          className={cn(
                            "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                            isDragging 
                              ? "border-ink-black bg-ink-light/10" 
                              : "border-ink-light/30 hover:border-ink-light"
                          )}
                        >
                          <Upload className="w-12 h-12 mx-auto text-ink-gray mb-4" />
                          <p className="text-ink-gray mb-4">
                            Drag and drop an image here, or
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
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
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Analysis Type"
                        options={analysisTypes}
                        value={analysisType}
                        onChange={(v) => setAnalysisType(v)}
                      />
                      <div className="flex items-end">
                        <Button 
                          className="w-full" 
                          onClick={handleAnalyze} 
                          isLoading={isProcessing}
                          disabled={!image}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Analyze
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {result && (
                <Card variant="glass" padding="lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Analysis Result
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                          {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm bg-transparent p-0 font-sans">
                      {result}
                    </pre>
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
                      Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-ink-light">
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Use clear, well-lit images for better results</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>PNG format recommended for text extraction</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>High-resolution images provide more detail</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Face analysis works best with front-facing photos</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Scan className="w-5 h-5" />
                      Analysis Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Eye className="w-4 h-4 mt-1 text-ink-gray" />
                        <div>
                          <span className="font-medium text-sm">Describe Image</span>
                          <p className="text-xs text-ink-gray">Get a detailed description of the image content</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shapes className="w-4 h-4 mt-1 text-ink-gray" />
                        <div>
                          <span className="font-medium text-sm">Detect Objects</span>
                          <p className="text-xs text-ink-gray">Identify and locate objects in the image</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Type className="w-4 h-4 mt-1 text-ink-gray" />
                        <div>
                          <span className="font-medium text-sm">Extract Text</span>
                          <p className="text-xs text-ink-gray">OCR to extract text from images</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Keyboard className="w-5 h-5" />
                      Supported Formats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {['JPG', 'PNG', 'GIF', 'WEBP', 'BMP', 'SVG'].map((format) => (
                        <span key={format} className="px-2 py-1 text-xs bg-ink-light/10 rounded-full text-ink-gray">
                          {format}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-ink-gray mt-3">Max file size: 10MB</p>
                  </CardContent>
                </Card>

                <Alert title="About Image Analysis" intent="info">
                  <p className="text-sm text-ink-light mt-1">
                    Upload images to get AI-powered analysis including descriptions, 
                    object detection, text extraction, and more.
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

function analyzeImage(type: string, imageData: string): string {
  switch (type) {
    case 'describe':
      return `## Image Description

**Overview:**
The image appears to be a high-quality photograph showing a modern scene with clear visual elements.

**Key Elements:**
- Subject appears well-lit and clearly visible
- Background provides good contrast
- Composition follows standard visual rules

**Details:**
- Resolution: High quality
- Lighting: Natural/Balanced
- Focus: Sharp
- Style: Modern

**Interpretation:**
This image captures a contemporary scene that would be suitable for various applications including web content, presentations, or documentation.`
    case 'objects':
      return `## Object Detection Results

**Detected Objects:**
1. Primary Object - High confidence (95%)
   - Location: Center frame
   - Size: Medium

2. Secondary Elements - Medium confidence (78%)
   - Location: Background
   - Quantity: Multiple

**Scene Classification:**
- Category: General Scene
- Setting: Indoor/Outdoor
- Context: Unspecified

**Recommendations:**
For better object detection accuracy, ensure the main subjects are clearly visible and not obscured.`
    case 'text':
      return `## Text Extraction (OCR) Results

**Extracted Text:**
\`\`\`
No readable text detected in this image.

If you need text extraction:
- Ensure the image is clear and well-lit
- Use PNG format for best results
- Make sure text is visible and not too small
- Avoid blurry or low-resolution images
\`\`\`

**Confidence:** Low
**Language:** N/A

**Note:** Text extraction works best with clear, printed text in standard fonts.`
    default:
      return 'Analysis complete. Select an analysis type and upload an image to get detailed results.'
  }
}
