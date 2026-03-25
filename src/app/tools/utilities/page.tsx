'use client'

import React, { useState, useCallback } from 'react'
import { Sidebar } from '@/components/layout'
import { Container } from '@/components/layout'
import { Header, Page } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Input, Tabs } from '@/components/ui'
import { 
  Code, Lock, Palette, Regex, Hash, Copy, Check, Download, 
  AlertTriangle, Eye, EyeOff, RefreshCw, Trash2, ArrowRightLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  generatePassword,
  generatePassphrase,
  checkPasswordStrength,
  parseColor,
  getContrastRatio,
  getWCAGLevel,
  generateShades,
  generateTints,
  generateComplementary,
  generateTriadic,
  testRegex,
  replaceWithRegex,
  explainRegex,
  COMMON_REGEX_PATTERNS,
  parseJson,
  formatJson,
  minifyJson,
  jsonToTypeScript,
  jsonToCsv,
  csvToJson,
} from '@/lib/tools'

export default function UtilitiesPage() {
  const [activeTab, setActiveTab] = useState('password')

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container>
          <Header
            title="Utilities"
            subtitle="Handy developer tools - no AI required"
          />

          <Tabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              { id: 'password', label: 'Password', icon: <Lock className="w-4 h-4" />, content: null },
              { id: 'colors', label: 'Colors', icon: <Palette className="w-4 h-4" />, content: null },
              { id: 'regex', label: 'Regex', icon: <Regex className="w-4 h-4" />, content: null },
              { id: 'json', label: 'JSON', icon: <Code className="w-4 h-4" />, content: null },
            ]}
          />

          <div className="mt-6">
            {activeTab === 'password' && <PasswordGenerator />}
            {activeTab === 'colors' && <ColorTools />}
            {activeTab === 'regex' && <RegexTester />}
            {activeTab === 'json' && <JsonTools />}
          </div>
        </Container>
      </Page>
    </div>
  )
}

function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [password, setPassword] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  })
  const [copied, setCopied] = useState(false)
  const [showStrength, setShowStrength] = useState(false)

  const generate = () => {
    const pwd = generatePassword({ length, ...options })
    setPassword(pwd)
    setShowStrength(true)
  }

  const generatePhrase = () => {
    setPassphrase(generatePassphrase(4))
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const strength = password ? checkPasswordStrength(password) : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card variant="paper" padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="w-5 h-5" />
            Password Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Length: {length}</label>
            <input
              type="range"
              min={8}
              max={64}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(options).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={value as boolean}
                  onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                  className="rounded"
                />
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>

          <Button onClick={generate} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Password
          </Button>

          {password && (
            <div className="p-4 bg-ink-light/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-ink-gray">Generated Password</span>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(password)}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <code className="text-sm break-all">{password}</code>
            </div>
          )}

          {strength && showStrength && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Strength:</span>
                <span style={{ color: strength.color }}>{strength.label}</span>
              </div>
              <div className="h-2 bg-ink-light/20 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(strength.score / 8) * 100}%`, backgroundColor: strength.color }}
                />
              </div>
              {strength.feedback.map((tip, i) => (
                <p key={i} className="text-xs text-ink-gray">• {tip}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card variant="paper" padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="w-5 h-5" />
            Passphrase Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-ink-light">
            Passphrases are easier to remember and can be just as secure as complex passwords.
          </p>

          <Button onClick={generatePhrase} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Passphrase
          </Button>

          {passphrase && (
            <div className="p-4 bg-ink-light/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-ink-gray">Generated Passphrase</span>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(passphrase)}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <code className="text-lg font-medium">{passphrase}</code>
            </div>
          )}

          <div className="text-sm text-ink-gray">
            <strong>Tips:</strong>
            <ul className="mt-2 space-y-1">
              <li>• Use 4-6 words for good security</li>
              <li>• Mix with numbers or symbols for extra security</li>
              <li>• Avoid common phrases</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ColorTools() {
  const [color, setColor] = useState('#3B82F6')
  const [colorData, setColorData] = useState<ReturnType<typeof parseColor> | null>(null)
  const [compareColor, setCompareColor] = useState('#FFFFFF')
  const [contrastRatio, setContrastRatio] = useState<number | null>(null)

  const analyze = useCallback(() => {
    const data = parseColor(color)
    setColorData(data)
    
    const ratio = getContrastRatio(color, compareColor)
    setContrastRatio(ratio)
  }, [color, compareColor])

  React.useEffect(() => {
    analyze()
  }, [analyze])

  const shades = colorData ? generateShades(colorData.hex) : []
  const tints = colorData ? generateTints(colorData.hex) : []
  const complementary = colorData ? generateComplementary(colorData.hex) : ''
  const [triadic1, triadic2] = colorData ? generateTriadic(colorData.hex) : ['', '']

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card variant="paper" padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="w-5 h-5" />
            Color Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-10 rounded cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Hex Value</label>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#3B82F6"
              />
            </div>
          </div>

          {colorData && (
            <div className="space-y-3">
              <div 
                className="h-24 rounded-lg shadow-inner"
                style={{ backgroundColor: colorData.hex }}
              />

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-3 bg-ink-light/10 rounded-lg text-center">
                  <div className="text-xs text-ink-gray">HEX</div>
                  <code>{colorData.hex}</code>
                </div>
                <div className="p-3 bg-ink-light/10 rounded-lg text-center">
                  <div className="text-xs text-ink-gray">RGB</div>
                  <code>{colorData.rgbString}</code>
                </div>
                <div className="p-3 bg-ink-light/10 rounded-lg text-center">
                  <div className="text-xs text-ink-gray">HSL</div>
                  <code>{colorData.hslString}</code>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Compare with</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={compareColor}
                onChange={(e) => setCompareColor(e.target.value)}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <Input
                value={compareColor}
                onChange={(e) => setCompareColor(e.target.value)}
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          {contrastRatio !== null && (
            <div className="p-4 bg-ink-light/10 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Contrast Ratio</span>
                <Badge>{contrastRatio.toFixed(2)}:1</Badge>
              </div>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-ink-gray">Normal Text:</span>{' '}
                  {contrastRatio >= 4.5 ? '✓ Pass' : '✗ Fail'}
                </div>
                <div>
                  <span className="text-ink-gray">Large Text:</span>{' '}
                  {contrastRatio >= 3 ? '✓ Pass' : '✗ Fail'}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card variant="paper" padding="lg">
        <CardHeader>
          <CardTitle className="text-lg">Color Palettes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Shades</h4>
            <div className="flex gap-1">
              {shades.map((shade, i) => (
                <div
                  key={i}
                  className="flex-1 h-12 cursor-pointer rounded"
                  style={{ backgroundColor: shade }}
                  onClick={() => {
                    navigator.clipboard.writeText(shade)
                  }}
                  title={shade}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Tints</h4>
            <div className="flex gap-1">
              {tints.map((tint, i) => (
                <div
                  key={i}
                  className="flex-1 h-12 cursor-pointer rounded"
                  style={{ backgroundColor: tint }}
                  onClick={() => {
                    navigator.clipboard.writeText(tint)
                  }}
                  title={tint}
                />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Harmonies</h4>
            <div className="grid grid-cols-3 gap-3">
              <div 
                className="p-3 bg-ink-light/10 rounded-lg text-center cursor-pointer"
                onClick={() => setColor(complementary)}
              >
                <div className="text-xs text-ink-gray mb-1">Complementary</div>
                <div 
                  className="h-10 rounded"
                  style={{ backgroundColor: complementary }}
                />
              </div>
              <div 
                className="p-3 bg-ink-light/10 rounded-lg text-center cursor-pointer"
                onClick={() => setColor(triadic1)}
              >
                <div className="text-xs text-ink-gray mb-1">Triadic 1</div>
                <div 
                  className="h-10 rounded"
                  style={{ backgroundColor: triadic1 }}
                />
              </div>
              <div 
                className="p-3 bg-ink-light/10 rounded-lg text-center cursor-pointer"
                onClick={() => setColor(triadic2)}
              >
                <div className="text-xs text-ink-gray mb-1">Triadic 2</div>
                <div 
                  className="h-10 rounded"
                  style={{ backgroundColor: triadic2 }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('The quick brown fox jumps over the lazy dog. email: test@example.com')
  const [result, setResult] = useState<ReturnType<typeof testRegex> | null>(null)
  const [replacement, setReplacement] = useState('')
  const [replaceResult, setReplaceResult] = useState('')

  const test = useCallback(() => {
    if (!pattern) return
    const res = testRegex(pattern, flags, testString)
    setResult(res)
  }, [pattern, flags, testString])

  const replace = useCallback(() => {
    if (!pattern) return
    const res = replaceWithRegex(pattern, flags, testString, replacement)
    setReplaceResult(res.result)
    setResult({ valid: true, matches: [], matchCount: res.replaceCount })
  }, [pattern, flags, testString, replacement])

  const useCommonPattern = (p: string) => {
    setPattern(p)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card variant="paper" padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Regex className="w-5 h-5" />
            Regex Tester
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Pattern</label>
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g., \d+|[a-z]+"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Flags</label>
            <div className="flex gap-4">
              {[
                { flag: 'g', label: 'Global' },
                { flag: 'i', label: 'Case insensitive' },
                { flag: 'm', label: 'Multiline' },
              ].map(({ flag, label }) => (
                <label key={flag} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flags.includes(flag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFlags(flags + flag)
                      } else {
                        setFlags(flags.replace(flag, ''))
                      }
                    }}
                    className="rounded"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Test String</label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-ink-cream/50 border border-ink-light/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={test}>Test</Button>
            <Button variant="secondary" onClick={replace}>Replace</Button>
          </div>

          {replacement && (
            <div>
              <label className="block text-sm font-medium mb-2">Replacement</label>
              <Input
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                placeholder="Replacement text (use $1, $2 for groups)"
              />
            </div>
          )}

          {replaceResult && (
            <div className="p-3 bg-ink-light/10 rounded-lg">
              <div className="text-xs text-ink-gray mb-1">Result ({result?.matchCount} replacements)</div>
              <code className="text-sm">{replaceResult}</code>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card variant="paper" padding="lg">
          <CardHeader>
            <CardTitle className="text-lg">Common Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_REGEX_PATTERNS.slice(0, 10).map((p) => (
                <button
                  key={p.name}
                  onClick={() => useCommonPattern(p.pattern)}
                  className="p-2 text-left text-sm bg-ink-light/10 rounded hover:bg-ink-light/20 transition-colors"
                >
                  <div className="font-medium">{p.name}</div>
                  <code className="text-xs text-ink-gray truncate block">{p.pattern}</code>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" padding="lg">
          <CardHeader>
            <CardTitle className="text-lg">Results</CardTitle>
          </CardHeader>
          <CardContent>
            {result?.error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {result.error}
              </div>
            )}

            {result?.valid && result.matches.length > 0 && (
              <div className="space-y-2">
                <Badge>{result.matchCount} matches</Badge>
                {result.matches.map((match, i) => (
                  <div key={i} className="p-2 bg-ink-light/10 rounded text-sm">
                    <code className="text-ink-black">"{match.match}"</code>
                    <span className="text-ink-gray ml-2">at index {match.index}</span>
                    {match.groups.length > 0 && (
                      <div className="text-xs text-ink-gray mt-1">
                        Groups: {match.groups.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {result?.valid && result.matches.length === 0 && !result.error && (
              <p className="text-sm text-ink-gray">No matches found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function JsonTools() {
  const [input, setInput] = useState('{"name": "John", "age": 30, "city": "New York"}')
  const [result, setResult] = useState<{ valid: boolean; error?: string } | null>(null)
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'format' | 'minify' | 'ts' | 'csv'>('format')

  const process = useCallback(() => {
    switch (mode) {
      case 'format':
        const formatted = formatJson(input)
        setResult({ valid: formatted.valid, error: formatted.error })
        setOutput(formatted.formatted || '')
        break
      case 'minify':
        const minified = minifyJson(input)
        setResult({ valid: minified.valid, error: minified.error })
        setOutput(minified.minified || '')
        break
      case 'ts':
        const ts = jsonToTypeScript(input)
        setResult({ valid: ts.valid, error: ts.error })
        setOutput(ts.typescript || '')
        break
      case 'csv':
        const csv = jsonToCsv(input)
        setResult({ valid: csv.valid, error: csv.error })
        setOutput(csv.csv || '')
        break
    }
  }, [input, mode])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card variant="paper" padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Code className="w-5 h-5" />
            JSON Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 bg-ink-light/10 border border-ink-light/30 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30 resize-none"
            placeholder="Paste JSON here..."
          />

          <div>
            <label className="block text-sm font-medium mb-2">Operation</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'format', label: 'Format' },
                { id: 'minify', label: 'Minify' },
                { id: 'ts', label: 'To TypeScript' },
                { id: 'csv', label: 'To CSV' },
              ].map(({ id, label }) => (
                <Button
                  key={id}
                  variant={mode === id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setMode(id as typeof mode)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={process} className="w-full">
            Process
          </Button>
        </CardContent>
      </Card>

      <Card variant="paper" padding="lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Output</CardTitle>
            {output && (
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {result?.error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm mb-4">
              {result.error}
            </div>
          )}

          {output && (
            <textarea
              value={output}
              readOnly
              rows={10}
              className="w-full px-4 py-3 bg-ink-light/10 border border-ink-light/30 rounded-lg font-mono text-sm resize-none"
            />
          )}

          {!output && !result?.error && (
            <div className="p-8 text-center text-ink-gray">
              Output will appear here
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
