'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout'
import { Container } from '@/components/layout'
import { Header, Page } from '@/components/layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui'
import { Select } from '@/components/forms'
import {
  Languages,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Keyboard,
  Globe,
  BookOpen,
  Sparkles,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
]

const presets = [
  { name: 'Spanish', source: 'en', target: 'es', label: '🇪🇸 English → Spanish' },
  { name: 'French', source: 'en', target: 'fr', label: '🇫🇷 English → French' },
  { name: 'German', source: 'en', target: 'de', label: '🇩🇪 English → German' },
  { name: 'Japanese', source: 'en', target: 'ja', label: '🇯🇵 English → Japanese' },
]

export default function TranslatePage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('es')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const [showDocsMobile, setShowDocsMobile] = useState(false)

  const handleTranslate = () => {
    if (!input.trim()) return
    setIsProcessing(true)
    
    setTimeout(() => {
      const translations: Record<string, Record<string, string>> = {
        'es': {
          'Hello': 'Hola',
          'Good morning': 'Buenos días',
          'Thank you': 'Gracias',
          'Hello, how are you?': 'Hola, ¿cómo estás?',
        },
        'fr': {
          'Hello': 'Bonjour',
          'Good morning': 'Bonjour',
          'Thank you': 'Merci',
          'Hello, how are you?': 'Bonjour, comment allez-vous?',
        },
        'de': {
          'Hello': 'Hallo',
          'Good morning': 'Guten Morgen',
          'Thank you': 'Danke',
          'Hello, how are you?': 'Hallo, wie geht es dir?',
        },
        'ja': {
          'Hello': 'こんにちは',
          'Good morning': 'おはようございます',
          'Thank you': 'ありがとう',
          'Hello, how are you?': 'こんにちは、お元気ですか？',
        },
      }

      const langTranslations = translations[targetLang] || translations['es']
      let translated = langTranslations[input.trim()] || `Translation for "${input.slice(0, 50)}${input.length > 50 ? '...' : ''}" will appear here. Connect to a translation API for actual results.`
      
      setOutput(translated)
      setIsProcessing(false)
    }, 1000)
  }

  const handleSwap = () => {
    const temp = sourceLang
    setSourceLang(targetLang)
    setTargetLang(temp)
    setInput(output)
    setOutput('')
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

  const handlePreset = (preset: typeof presets[0]) => {
    setSourceLang(preset.source)
    setTargetLang(preset.target)
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
            title="Translation"
            subtitle="Translate text between 50+ languages"
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
                  <div className="flex flex-wrap gap-2 mb-4">
                    {presets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handlePreset(preset)}
                        className={cn(
                          "px-3 py-1.5 text-sm rounded-full border transition-colors",
                          sourceLang === preset.source && targetLang === preset.target
                            ? "bg-ink-black text-ink-paper border-ink-black"
                            : "bg-transparent border-ink-light/30 text-ink-gray hover:border-ink-black"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass" padding="md">
                <CardContent className="p-4 lg:p-6">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Translate
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={handleSwap} disabled={!input && !output}>
                        Swap
                      </Button>
                    </div>
                  </CardHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-ink-black">Source</label>
                        <Select
                          options={languages}
                          value={sourceLang}
                          onChange={(v) => setSourceLang(v)}
                          className="w-36"
                        />
                      </div>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter text to translate..."
                        className="w-full h-48 lg:h-64 px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30 resize-none"
                      />
                      <div className="text-xs text-ink-gray mt-2">{input.length} characters</div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-ink-black">Target</label>
                        <Select
                          options={languages}
                          value={targetLang}
                          onChange={(v) => setTargetLang(v)}
                          className="w-36"
                        />
                      </div>
                      <div className="relative">
                        <textarea
                          value={output}
                          readOnly
                          placeholder="Translation will appear here..."
                          className="w-full h-48 lg:h-64 px-4 py-3 bg-ink-light/10 border border-ink-light/30 rounded-lg focus:outline-none resize-none"
                        />
                        {output && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleCopy}
                          >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-ink-gray mt-2">{output.length} characters</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button onClick={handleTranslate} isLoading={isProcessing} disabled={!input.trim()}>
                      <Languages className="w-4 h-4 mr-2" />
                      Translate
                    </Button>
                    <Button variant="ghost" onClick={handleReset}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
                        <span>Use simple, clear sentences for better accuracy</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Specialized terms may need manual review</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Click Swap to reverse translation direction</span>
                      </li>
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
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-ink-gray">Translate</span>
                        <kbd className="px-2 py-1 bg-ink-light/10 rounded text-xs font-mono">Ctrl + Enter</kbd>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-ink-gray">Swap languages</span>
                        <kbd className="px-2 py-1 bg-ink-light/10 rounded text-xs font-mono">Ctrl + S</kbd>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="w-5 h-5" />
                      Supported Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-ink-gray mb-4">
                      Supports 25+ languages including:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {languages.slice(0, 8).map((lang) => (
                        <span key={lang.value} className="px-2 py-1 text-xs bg-ink-light/10 rounded-full text-ink-gray">
                          {lang.label}
                        </span>
                      ))}
                      <span className="px-2 py-1 text-xs bg-ink-light/10 rounded-full text-ink-gray">
                        + 17 more
                      </span>
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
