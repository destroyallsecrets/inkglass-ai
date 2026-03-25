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
import { Select } from '@/components/forms'
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
  FileText,
  X,
  Download,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  writingTypes,
  toneModifiers,
  generateTemplate,
  generateSocialPost,
  type WritingType,
  type Tone,
} from '@/lib/writer'

const tones: { value: Tone; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
]

const writingTypeOptions = Object.entries(writingTypes).map(([value, data]) => ({
  value,
  label: data.name,
  description: data.description,
}))

export default function WritePage() {
  const [writingType, setWritingType] = useState<WritingType>('email')
  const [tone, setTone] = useState<Tone>('professional')
  const [recipient, setRecipient] = useState('')
  const [sender, setSender] = useState('')
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [showDocs, setShowDocs] = useState(false)

  const handleGenerate = () => {
    const template = generateTemplate(writingType, {
      recipient,
      sender,
      subject,
      topic,
      tone,
    })
    setOutput(template)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const extensions: Record<WritingType, string> = {
      'email': 'txt',
      'letter': 'txt',
      'memo': 'txt',
      'report': 'md',
      'proposal': 'md',
      'resume': 'md',
      'blog-post': 'md',
      'social-post': 'txt',
      'press-release': 'txt',
    }
    const filename = `${writingType}.${extensions[writingType]}`
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setRecipient('')
    setSender('')
    setSubject('')
    setTopic('')
    setOutput('')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <div className="lg:hidden fixed top-0 right-0 z-50 p-4">
          <Button variant="secondary" size="sm" onClick={() => setShowDocs(!showDocs)}>
            {showDocs ? <X className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
          </Button>
        </div>

        <div className="p-4 lg:p-8">
          <Header
            title="Writing Assistant"
            subtitle="Generate writing templates for common formats"
            className="mb-6"
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className={cn(
              "space-y-6",
              showDocs ? "xl:col-span-2" : "xl:col-span-3"
            )}>
              <Card variant="paper" padding="md">
                <CardContent className="p-4 lg:p-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="flex items-center gap-2">
                      <PenTool className="w-5 h-5" />
                      Template Configuration
                    </CardTitle>
                  </CardHeader>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Select
                      label="Writing Type"
                      options={writingTypeOptions.map(t => ({ value: t.value, label: t.label }))}
                      value={writingType}
                      onChange={(v) => setWritingType(v as WritingType)}
                    />
                    <Select
                      label="Tone"
                      options={tones}
                      value={tone}
                      onChange={(v) => setTone(v as Tone)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-ink-black mb-2">
                        Recipient (To)
                      </label>
                      <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="e.g., John Smith, Hiring Manager"
                        className="w-full px-4 py-2 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-black mb-2">
                        Sender (From)
                      </label>
                      <input
                        type="text"
                        value={sender}
                        onChange={(e) => setSender(e.target.value)}
                        placeholder="e.g., Your Name"
                        className="w-full px-4 py-2 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-ink-black mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Meeting Request, Project Update"
                      className="w-full px-4 py-2 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-ink-black mb-2">
                      Topic / Main Points
                    </label>
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Describe the main topic or key points to include..."
                      className="w-full h-32 px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30 resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button onClick={handleGenerate}>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Template
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
                          Generated Template
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={handleCopy}>
                            {copied ? (
                              <Check className="w-4 h-4 mr-2 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 mr-2" />
                            )}
                            {copied ? 'Copied!' : 'Copy'}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <pre className="whitespace-pre-wrap text-sm bg-ink-light/10 p-4 rounded-lg font-sans">
                      {output}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Documentation Panel */}
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
                        <span>Select a writing type template</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Choose your preferred tone</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Fill in the context fields</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Generate and customize your template</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="w-5 h-5" />
                      Available Templates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {writingTypeOptions.map((type) => (
                        <div key={type.value} className="flex items-start gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full mt-2",
                            writingType === type.value ? "bg-ink-black" : "bg-ink-light"
                          )} />
                          <div>
                            <span className={cn(
                              "text-sm font-medium",
                              writingType === type.value ? "text-ink-black" : "text-ink-gray"
                            )}>
                              {type.label}
                            </span>
                            <p className="text-xs text-ink-light">{type.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Keyboard className="w-5 h-5" />
                      Tone Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium">Formal</span>
                        <p className="text-ink-gray">Business reports, official letters, academic writing</p>
                      </div>
                      <div>
                        <span className="font-medium">Professional</span>
                        <p className="text-ink-gray">Client communications, proposals, memos</p>
                      </div>
                      <div>
                        <span className="font-medium">Casual</span>
                        <p className="text-ink-gray">Friendly emails, internal communications</p>
                      </div>
                      <div>
                        <span className="font-medium">Friendly</span>
                        <p className="text-ink-gray">Informal notes, team updates</p>
                      </div>
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
