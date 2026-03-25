'use client'

import React, { useState, useMemo } from 'react'
import { Sidebar } from '@/components/layout'
import { Container } from '@/components/layout'
import { Header, Page, Section } from '@/components/layout'
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
  Code,
  Play,
  Copy,
  Check,
  RefreshCw,
  Save,
  HelpCircle,
  Lightbulb,
  Keyboard,
  BookOpen,
  FileCode,
  Download,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  generateCode,
  templateOptions,
  languageOptions,
  getAvailableTemplates,
  type TemplateType,
  type Language,
  type TemplateContext,
} from '@/lib/code-templates'

const templateTypes = Object.entries(templateOptions).map(([value, data]) => ({
  value,
  label: data.label,
  description: data.description,
}))

export default function CodePage() {
  const [language, setLanguage] = useState<Language>('typescript')
  const [templateType, setTemplateType] = useState<TemplateType>('function')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [props, setProps] = useState('')
  const [methods, setMethods] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [showDocs, setShowDocs] = useState(true)
  const [generated, setGenerated] = useState(false)

  const availableTemplates = useMemo(() => {
    return templateTypes.filter(t => getAvailableTemplates(language).includes(t.value as TemplateType))
  }, [language])

  const handleGenerate = () => {
    if (!name.trim()) return
    
    const context: TemplateContext = {
      name: name.trim(),
      description: description.trim() || undefined,
      props: props.trim() ? props.split(',').map(p => p.trim()).filter(Boolean) : undefined,
      methods: methods.trim() ? methods.split(',').map(m => m.trim()).filter(Boolean) : undefined,
    }
    
    const code = generateCode(templateType, language, context)
    setOutput(code)
    setGenerated(true)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const extension = languageOptions[language].extensions
    const filename = `${name.toLowerCase().replace(/\s+/g, '-')}.${extension}`
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setName('')
    setDescription('')
    setProps('')
    setMethods('')
    setOutput('')
    setGenerated(false)
  }

  const keyboardShortcuts = [
    { keys: ['Ctrl', 'Enter'], action: 'Generate code' },
    { keys: ['Ctrl', 'Shift', 'C'], action: 'Copy output' },
    { keys: ['Ctrl', '/'], action: 'Toggle docs' },
  ]

  const tips = [
    'Use PascalCase for component/class names',
    'Separate multiple props/methods with commas',
    'Check the docs panel for available templates',
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container>
          <Header
            title="Code Generation"
            subtitle="Generate boilerplate code from templates"
            actions={
              <Button variant="secondary" onClick={() => setShowDocs(!showDocs)}>
                <HelpCircle className="w-4 h-4 mr-2" />
                {showDocs ? 'Hide Docs' : 'Show Docs'}
              </Button>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={cn("space-y-6", showDocs ? "lg:col-span-2" : "lg:col-span-3")}>
              <Card variant="paper" padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="w-5 h-5" />
                    Code Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Select
                      label="Language"
                      options={Object.entries(languageOptions).map(([value, data]) => ({
                        value,
                        label: data.label,
                      }))}
                      value={language}
                      onChange={(v) => setLanguage(v as Language)}
                    />
                    <Select
                      label="Template Type"
                      options={availableTemplates.map(t => ({
                        value: t.value,
                        label: t.label,
                      }))}
                      value={templateType}
                      onChange={(v) => setTemplateType(v as TemplateType)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-ink-black mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., UserProfile, fetchData, ApiController"
                        className="w-full px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink-black mb-2">
                        Description (optional)
                      </label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of what this code does"
                        className="w-full px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ink-black mb-2">
                          Props/Parameters (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={props}
                          onChange={(e) => setProps(e.target.value)}
                          placeholder="e.g., userId, name, email"
                          className="w-full px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink-black mb-2">
                          Methods (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={methods}
                          onChange={(e) => setMethods(e.target.value)}
                          placeholder="e.g., validate, save, delete"
                          className="w-full px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <Button 
                      onClick={handleGenerate} 
                      disabled={!name.trim()}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Generate Code
                    </Button>
                    <Button variant="ghost" onClick={handleReset}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {output && (
                <Card variant="glass" padding="lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        Generated Code
                      </CardTitle>
                      <div className="flex items-center gap-2">
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
                  <CardContent>
                    <pre className="bg-ink-light/10 p-4 rounded-lg overflow-x-auto font-mono text-sm whitespace-pre-wrap">
                      {output}
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
                    <ul className="space-y-2">
                      {tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-ink-light">
                          <span className="text-ink-gray">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Keyboard className="w-5 h-5" />
                      Shortcuts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {keyboardShortcuts.map((shortcut, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-ink-gray">{shortcut.action}</span>
                          <div className="flex gap-1">
                            {shortcut.keys.map((key, j) => (
                              <kbd key={j} className="px-2 py-1 bg-ink-light/10 rounded text-xs font-mono">
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
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
                      {availableTemplates.map((template) => (
                        <div key={template.value} className="flex items-start gap-3">
                          <ChevronRight className="w-4 h-4 text-ink-gray mt-0.5 flex-shrink-0" />
                          <div>
                            <span className={cn(
                              "text-sm font-medium",
                              templateType === template.value ? "text-ink-black" : "text-ink-gray"
                            )}>
                              {template.label}
                            </span>
                            <p className="text-xs text-ink-light mt-0.5">{template.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Alert title="Template-Based Code Generation" intent="info">
                  <p className="text-sm text-ink-light mt-1">
                    Generate boilerplate code instantly from pre-built templates. 
                    No AI required - fast and reliable.
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
