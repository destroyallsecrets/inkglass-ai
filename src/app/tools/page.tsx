'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout'
import { Container } from '@/components/layout'
import { Header, Page, Section } from '@/components/layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Modal,
  Progress,
} from '@/components/ui'
import { Textarea } from '@/components/ui'
import { Select, Toggle } from '@/components/forms'
import { ResponseCard } from '@/components/ai'
import {
  Sparkles,
  Code,
  FileText,
  Image,
  Languages,
  PenTool,
  Search,
  ArrowRight,
  Copy,
  Settings,
  Play,
  RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const tools = [
  {
    id: 'code',
    name: 'Code Assistant',
    description: 'Write, debug, and optimize code in multiple languages',
    icon: <Code className="w-6 h-6" />,
    color: 'bg-blue-500/10 text-blue-600',
    href: '/tools/code',
  },
  {
    id: 'writing',
    name: 'Writing Assistant',
    description: 'Generate and edit content with AI-powered suggestions',
    icon: <PenTool className="w-6 h-6" />,
    color: 'bg-purple-500/10 text-purple-600',
    href: '/tools/writing',
  },
  {
    id: 'translation',
    name: 'Translation',
    description: 'Translate text between 50+ languages',
    icon: <Languages className="w-6 h-6" />,
    color: 'bg-green-500/10 text-green-600',
    href: '/tools/translation',
  },
  {
    id: 'analysis',
    name: 'Data Analysis',
    description: 'Analyze and visualize data patterns',
    icon: <Search className="w-6 h-6" />,
    color: 'bg-orange-500/10 text-orange-600',
    href: '/tools/analysis',
  },
  {
    id: 'image',
    name: 'Image Analysis',
    description: 'Describe and analyze images with precision',
    icon: <Image className="w-6 h-6" />,
    color: 'bg-pink-500/10 text-pink-600',
    href: '/tools/image',
  },
  {
    id: 'summarize',
    name: 'Summarization',
    description: 'Condense long documents into key insights',
    icon: <FileText className="w-6 h-6" />,
    color: 'bg-indigo-500/10 text-indigo-600',
    href: '/tools/summarize',
  },
]

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleProcess = async () => {
    if (!input.trim()) return
    setIsProcessing(true)
    
    try {
      const responses = [
        `Based on your input "${input.slice(0, 50)}${input.length > 50 ? '...' : ''}", here are the results:\n\nThis is a simulated AI response. Connect to a real AI API to get actual results.`,
        `Analysis complete for: "${input.slice(0, 30)}${input.length > 30 ? '...' : ''}"\n\nKey findings:\n- Processed successfully\n- Results generated\n- Ready for review`,
        `Here is the processed output based on your request.\n\nThe AI has analyzed your input and generated relevant content.`,
      ]
      setOutput(responses[Math.floor(Math.random() * responses.length)])
    } catch (error) {
      console.error('Processing error:', error)
      setOutput('An error occurred while processing your request.')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderToolContent = () => {
    switch (activeTool) {
      case 'code':
        return (
          <div className="space-y-4">
            <Textarea
              label="Code Input"
              placeholder="Paste your code here or describe what you want to build..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={10}
            />
            <div className="flex items-center gap-4">
              <Select
                label="Language"
                options={[
                  { value: 'javascript', label: 'JavaScript' },
                  { value: 'typescript', label: 'TypeScript' },
                  { value: 'python', label: 'Python' },
                  { value: 'go', label: 'Go' },
                  { value: 'rust', label: 'Rust' },
                ]}
                value="javascript"
                onChange={() => {}}
              />
              <Select
                label="Action"
                options={[
                  { value: 'write', label: 'Write Code' },
                  { value: 'debug', label: 'Debug' },
                  { value: 'explain', label: 'Explain' },
                  { value: 'optimize', label: 'Optimize' },
                ]}
                value="write"
                onChange={() => {}}
              />
            </div>
          </div>
        )
      case 'writing':
        return (
          <div className="space-y-4">
            <Textarea
              label="Content"
              placeholder="Enter your text or describe what you want to write..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={8}
            />
            <Select
              label="Writing Style"
              options={[
                { value: 'formal', label: 'Formal' },
                { value: 'casual', label: 'Casual' },
                { value: 'technical', label: 'Technical' },
                { value: 'creative', label: 'Creative' },
              ]}
              value="formal"
              onChange={() => {}}
            />
          </div>
        )
      case 'translation':
        return (
          <div className="space-y-4">
            <Textarea
              label="Text to Translate"
              placeholder="Enter text to translate..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
            />
            <div className="flex items-center gap-4">
              <Select
                label="Source Language"
                options={[
                  { value: 'auto', label: 'Auto Detect' },
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                ]}
                value="auto"
                onChange={() => {}}
              />
              <ArrowRight className="w-5 h-5 text-ink-gray mt-8" />
              <Select
                label="Target Language"
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                ]}
                value="es"
                onChange={() => {}}
              />
            </div>
          </div>
        )
      default:
        return (
          <Textarea
            label="Input"
            placeholder="Enter your content here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
          />
        )
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container>
          <Header
            title="AI Tools"
            subtitle="Powerful AI-powered tools for various tasks"
            actions={
              <Button variant="secondary" onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Tool Settings
              </Button>
            }
          />

          <Section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="cursor-pointer"
                >
                <Card
                  variant="paper"
                  padding="md"
                  hover
                  className={cn(
                    '',
                    activeTool === tool.id ? 'ring-2 ring-ink-black' : ''
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', tool.color)}>
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{tool.name}</h4>
                      <p className="text-sm text-ink-gray mt-1">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Card>
                </div>
              ))}
            </div>
          </Section>

          {activeTool && (
            <Section title="Tool Interface" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card variant="paper" padding="lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {tools.find((t) => t.id === activeTool)?.icon}
                      {tools.find((t) => t.id === activeTool)?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderToolContent()}
                    
                    <div className="mt-6 flex items-center gap-3">
                      <Button onClick={handleProcess} isLoading={isProcessing}>
                        <Play className="w-4 h-4 mr-2" />
                        {isProcessing ? 'Processing...' : 'Process'}
                      </Button>
                      <Button variant="ghost" onClick={() => { setInput(''); setOutput('') }}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="glass" padding="lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Output</CardTitle>
                      {output && (
                        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(output)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isProcessing ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full border-2 border-ink-black border-t-transparent animate-spin" />
                          <span className="text-ink-gray">Processing...</span>
                        </div>
                        <Progress value={65} showLabel />
                      </div>
                    ) : output ? (
                      <pre className="whitespace-pre-wrap font-mono text-sm bg-ink-light/10 p-4 rounded-lg overflow-x-auto">
                        {output}
                      </pre>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-ink-light/10 flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-8 h-8 text-ink-gray" />
                        </div>
                        <p className="text-ink-gray">
                          Output will appear here after processing
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </Section>
          )}

          <Section title="Recent Results" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponseCard
                title="Code Optimization"
                content="// Optimized function\nfunction processData(arr) {\n  return arr.reduce((acc, val) => {\n    if (val > 0) acc.push(val * 2);\n    return acc;\n  }, []);\n}"
                type="code"
                category="Code"
                confidence={92}
              />
              <ResponseCard
                title="Translation Result"
                content="The quick brown fox jumps over the lazy dog.\n\nEl rápido zorro marrón salta sobre el perro perezoso."
                type="text"
                category="Translation"
                confidence={98}
              />
            </div>
          </Section>
        </Container>
      </Page>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Tool Settings"
      >
        <div className="space-y-6">
          <Toggle label="Enable streaming responses" checked />
          <Toggle label="Show confidence scores" checked />
          <Toggle label="Auto-save results" />
          <Toggle label="Enable advanced mode" />

          <Select
            label="Response Quality"
            options={[
              { value: 'fast', label: 'Fast (Lower quality)' },
              { value: 'balanced', label: 'Balanced' },
              { value: 'quality', label: 'Quality (Slower)' },
            ]}
            value="balanced"
            onChange={() => {}}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowSettings(false)}>
              Save Settings
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
