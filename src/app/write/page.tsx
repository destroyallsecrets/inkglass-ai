'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout'
import { Page } from '@/components/layout'
import { Header } from '@/components/layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'
import { Select, Toggle } from '@/components/forms'
import {
  PenTool,
  Copy,
  Check,
  RefreshCw,
  Save,
  HelpCircle,
  Lightbulb,
  Keyboard,
  BookOpen,
  Sparkles,
  FileText,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const writingTypes = [
  { value: 'blog', label: 'Blog Post' },
  { value: 'email', label: 'Email' },
  { value: 'social', label: 'Social Media' },
  { value: 'business', label: 'Business' },
  { value: 'creative', label: 'Creative' },
  { value: 'academic', label: 'Academic' },
]

const tones = [
  { value: 'formal', label: 'Formal' },
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'persuasive', label: 'Persuasive' },
]

const lengths = [
  { value: 'short', label: 'Short (100-200 words)' },
  { value: 'medium', label: 'Medium (300-500 words)' },
  { value: 'long', label: 'Long (800-1000 words)' },
]

export default function WritePage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [writingType, setWritingType] = useState('blog')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [seoOptimized, setSeoOptimized] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const [showDocsMobile, setShowDocsMobile] = useState(false)

  const handleGenerate = () => {
    if (!input.trim()) return
    setIsProcessing(true)
    
    setTimeout(() => {
      const generatedContent = generateWriting(writingType, tone, length, input, seoOptimized)
      setOutput(generatedContent)
      setIsProcessing(false)
    }, 2000)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setInput('')
    setOutput('')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <div className="lg:hidden fixed top-0 right-0 z-50 p-4">
          <Button variant="secondary" size="sm" onClick={() => setShowDocsMobile(!showDocsMobile)}>
            {showDocsMobile ? <X className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
          </Button>
        </div>

        <div className="p-4 lg:p-8">
          <Header
            title="Writing Assistant"
            subtitle="Generate and enhance content with AI"
            className="mb-6"
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className={cn(
              "space-y-6",
              showDocs || showDocsMobile ? "xl:col-span-2" : "xl:col-span-3"
            )}>
              <Card variant="paper" padding="md">
                <CardContent className="p-4 lg:p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="flex items-center gap-2">
                      <PenTool className="w-5 h-5" />
                      Writing Configuration
                    </CardTitle>
                  </CardHeader>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <Select
                      label="Type"
                      options={writingTypes}
                      value={writingType}
                      onChange={(v) => setWritingType(v)}
                    />
                    <Select
                      label="Tone"
                      options={tones}
                      value={tone}
                      onChange={(v) => setTone(v)}
                    />
                    <Select
                      label="Length"
                      options={lengths}
                      value={length}
                      onChange={(v) => setLength(v)}
                    />
                  </div>

                  {writingType === 'blog' && (
                    <div className="mb-4">
                      <Toggle
                        label="SEO Optimized"
                        checked={seoOptimized}
                        onChange={setSeoOptimized}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-ink-black mb-2">
                      Topic or Brief
                    </label>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={getPlaceholder(writingType)}
                      className="w-full h-40 px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30 resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button onClick={handleGenerate} isLoading={isProcessing} disabled={!input.trim()}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                    <Button variant="ghost" onClick={handleReset}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {output && (
                <Card variant="glass" padding="md">
                  <CardContent className="p-4 lg:p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Generated Content
                        </CardTitle>
                        <div className="flex gap-2">
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
                    <pre className="whitespace-pre-wrap text-sm bg-transparent p-0 font-sans">
                      {output}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Documentation Panel */}
            {(showDocs || showDocsMobile) && (
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
                        <span>Be specific about your target audience</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Include key points you want covered</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Mention the desired call-to-action</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Enable SEO for web content</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Keyboard className="w-5 h-5" />
                      Writing Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {writingTypes.map((type) => (
                        <div
                          key={type.value}
                          className={cn(
                            "p-2 rounded-lg text-sm",
                            writingType === type.value
                              ? "bg-ink-black text-ink-paper"
                              : "hover:bg-ink-light/10"
                          )}
                        >
                          {type.label}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="w-5 h-5" />
                      Tone Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Formal:</span> <span className="text-ink-gray">Business reports, academic</span></div>
                      <div><span className="font-medium">Professional:</span> <span className="text-ink-gray">Client communications</span></div>
                      <div><span className="font-medium">Casual:</span> <span className="text-ink-gray">Friendly emails, blog</span></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Page>
    </div>
  )
}

function getPlaceholder(type: string): string {
  switch (type) {
    case 'blog':
      return 'Write a blog post about [topic]. Include key points: ...'
    case 'email':
      return 'Write a follow-up email after [event]. Tone: professional...'
    case 'social':
      return 'Create an Instagram post about [product]. Include CTA...'
    case 'business':
      return 'Project proposal for [project]. Include timeline and budget...'
    default:
      return 'Describe what you want to write about...'
  }
}

function generateWriting(type: string, tone: string, length: string, topic: string, seo: boolean): string {
  const wordCount = length === 'short' ? 150 : length === 'long' ? 800 : 400
  
  return `${topic}

Introduction:
This comprehensive guide explores the key aspects of ${topic.toLowerCase()}. Whether you're new to this topic or looking to deepen your understanding, this article provides valuable insights.

Key Points:
• Understanding the fundamentals
• Best practices for implementation
• Common challenges and solutions
• Actionable steps to get started

Conclusion:
${topic} offers significant benefits. Start implementing these strategies today and track your progress over time.

${seo && type === 'blog' ? '## Related Topics\n- Getting Started Guide\n- FAQ\n## Share This Article' : ''}`
}
