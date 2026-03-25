'use client'

import React, { useState, useCallback } from 'react'
import { Sidebar } from '@/components/layout'
import { Container } from '@/components/layout'
import { Header, Page } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Tabs, Alert } from '@/components/ui'
import { Code, AlertTriangle, CheckCircle, Lightbulb, Copy, Download, RefreshCw, Shield, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  analyzeCode, 
  analyzeComplexity, 
  analyzeSecurity, 
  analyzeBestPractices,
  type ComplexityResult,
  type SecurityIssue,
  type CodeAnalysisResult 
} from '@/lib/code-analysis'

const GRADE_COLORS = {
  A: 'text-green-600 bg-green-100',
  B: 'text-blue-600 bg-blue-100',
  C: 'text-yellow-600 bg-yellow-100',
  D: 'text-orange-600 bg-orange-100',
  F: 'text-red-600 bg-red-100',
}

const SEVERITY_COLORS = {
  high: 'text-red-600 bg-red-100',
  medium: 'text-yellow-600 bg-yellow-100',
  low: 'text-blue-600 bg-blue-100',
}

export default function CodeAnalysisPage() {
  const [code, setCode] = useState(`// Sample JavaScript code
const apiKey = 'sk-1234567890abcdef';

function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].price > 0) {
      total += items[i].price;
    }
  }
  return total;
}

async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}`)

  const [result, setResult] = useState<CodeAnalysisResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = useCallback(() => {
    setIsAnalyzing(true)
    setTimeout(() => {
      const analysis = analyzeCode(code)
      setResult(analysis)
      setIsAnalyzing(false)
    }, 500)
  }, [code])

  const handleCopy = async () => {
    if (!result) return
    const report = generateReport(result)
    await navigator.clipboard.writeText(report)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!result) return
    const report = generateReport(result)
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'code-analysis-report.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateReport = (r: CodeAnalysisResult) => {
    return `# Code Analysis Report

## Complexity Metrics
- Cyclomatic Complexity: ${r.complexity.cyclomaticComplexity}
- Lines of Code: ${r.complexity.linesOfCode}
- Comment Ratio: ${r.complexity.commentRatio.toFixed(1)}%
- Maintainability Index: ${r.complexity.maintainabilityIndex}
- Grade: ${r.complexity.grade}

## Security Issues (${r.security.length})
${r.security.map(s => `- [${s.severity.toUpperCase()}] Line ${s.line}: ${s.message}`).join('\n')}

## Best Practices (${r.bestPractices.length})
${r.bestPractices.map(p => `- Line ${p.line}: ${p.message}`).join('\n')}

## Suggestions
${r.suggestions.map(s => `- ${s}`).join('\n')}
`
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container>
          <Header
            title="Code Analysis"
            subtitle="Analyze code complexity, security, and best practices"
            actions={
              <Button variant="secondary" onClick={handleAnalyze} disabled={isAnalyzing}>
                <Activity className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
              </Button>
            }
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            <div className="xl:col-span-2 space-y-4 lg:space-y-6">
              <Card variant="paper" padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Code className="w-5 h-5" />
                    Source Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={15}
                    className="w-full px-4 py-3 bg-ink-light/10 border border-ink-light/30 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium resize-none"
                    placeholder="Paste your code here..."
                  />
                </CardContent>
              </Card>

              {result && (
                <Card variant="glass" padding="lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Lightbulb className="w-5 h-5" />
                        Analysis Results
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                          {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDownload}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs
                      tabs={[
                        {
                          id: 'complexity',
                          label: 'Complexity',
                          icon: <Activity className="w-4 h-4" />,
                          content: (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="text-center p-4 bg-ink-light/10 rounded-lg">
                                  <div className="text-2xl font-bold">{result.complexity.cyclomaticComplexity}</div>
                                  <div className="text-xs text-ink-gray mt-1">Complexity</div>
                                </div>
                                <div className="text-center p-4 bg-ink-light/10 rounded-lg">
                                  <div className="text-2xl font-bold">{result.complexity.linesOfCode}</div>
                                  <div className="text-xs text-ink-gray mt-1">Lines</div>
                                </div>
                                <div className="text-center p-4 bg-ink-light/10 rounded-lg">
                                  <div className="text-2xl font-bold">{result.complexity.maintainabilityIndex}</div>
                                  <div className="text-xs text-ink-gray mt-1">Maint. Index</div>
                                </div>
                                <div className="text-center p-4 bg-ink-light/10 rounded-lg">
                                  <span className={cn(
                                    "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full",
                                    GRADE_COLORS[result.complexity.grade]
                                  )}>
                                    Grade {result.complexity.grade}
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-ink-gray">Functions:</span>
                                  <span className="font-medium">{result.complexity.functionCount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-ink-gray">Classes:</span>
                                  <span className="font-medium">{result.complexity.classCount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-ink-gray">Imports:</span>
                                  <span className="font-medium">{result.complexity.importCount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-ink-gray">Comments:</span>
                                  <span className="font-medium">{result.complexity.linesOfComments}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-ink-gray">Comment Ratio:</span>
                                  <span className="font-medium">{result.complexity.commentRatio.toFixed(1)}%</span>
                                </div>
                              </div>
                            </div>
                          ),
                        },
                        {
                          id: 'security',
                          label: 'Security',
                          icon: <Shield className="w-4 h-4" />,
                          content: (
                            <div className="space-y-3">
                              {result.security.length === 0 ? (
                                <Alert title="No security issues found" intent="success">
                                  Your code appears to be secure!
                                </Alert>
                              ) : (
                                result.security.map((issue, i) => (
                                  <div key={i} className="flex items-start gap-3 p-3 bg-ink-light/10 rounded-lg">
                                    <AlertTriangle className={cn(
                                      "w-5 h-5 flex-shrink-0",
                                      issue.severity === 'high' ? "text-red-500" :
                                      issue.severity === 'medium' ? "text-yellow-500" : "text-blue-500"
                                    )} />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className={cn(
                                          "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full",
                                          SEVERITY_COLORS[issue.severity]
                                        )}>
                                          {issue.severity}
                                        </span>
                                        <span className="text-xs text-ink-gray">Line {issue.line}</span>
                                      </div>
                                      <p className="text-sm">{issue.message}</p>
                                      <p className="text-xs text-ink-gray mt-1">Type: {issue.type}</p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          ),
                        },
                        {
                          id: 'practices',
                          label: 'Best Practices',
                          icon: <CheckCircle className="w-4 h-4" />,
                          content: (
                            <div className="space-y-3">
                              {result.bestPractices.length === 0 ? (
                                <Alert title="Looking good!" intent="success">
                                  No best practice issues detected.
                                </Alert>
                              ) : (
                                result.bestPractices.map((practice, i) => (
                                  <div key={i} className="flex items-start gap-3 p-3 bg-ink-light/10 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <div className="flex-1">
                                      <div className="text-sm">
                                        <span className="text-ink-gray">Line {practice.line}:</span> {practice.message}
                                      </div>
                                      <span className="mt-1 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border border-ink-light/30 bg-ink-light/10">
                                        {practice.type}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          ),
                        },
                        {
                          id: 'suggestions',
                          label: 'Suggestions',
                          icon: <Lightbulb className="w-4 h-4" />,
                          content: (
                            <div className="space-y-3">
                              {result.suggestions.length === 0 ? (
                                <Alert title="Great job!" intent="success">
                                  No suggestions at this time. Your code is well-structured!
                                </Alert>
                              ) : (
                                result.suggestions.map((suggestion, i) => (
                                  <div key={i} className="flex items-start gap-3 p-3 bg-ink-light/10 rounded-lg">
                                    <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                    <p className="text-sm">{suggestion}</p>
                                  </div>
                                ))
                              )}
                            </div>
                          ),
                        },
                      ]}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4 lg:space-y-6">
              <Card variant="paper" padding="md">
                <CardHeader>
                  <CardTitle className="text-lg">What We Analyze</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4" /> Complexity
                    </h4>
                    <ul className="text-sm text-ink-gray space-y-1">
                      <li>• Cyclomatic complexity</li>
                      <li>• Maintainability index</li>
                      <li>• Code grade (A-F)</li>
                      <li>• Lines of code/comments</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" /> Security
                    </h4>
                    <ul className="text-sm text-ink-gray space-y-1">
                      <li>• Hardcoded secrets</li>
                      <li>• XSS vulnerabilities</li>
                      <li>• Code injection risks</li>
                      <li>• Console statements</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Best Practices
                    </h4>
                    <ul className="text-sm text-ink-gray space-y-1">
                      <li>• TypeScript any usage</li>
                      <li>• Equality checks</li>
                      <li>• Variable declarations</li>
                      <li>• Empty catch blocks</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card variant="ink" padding="md">
                <CardHeader>
                  <CardTitle className="text-lg">Supported Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['JavaScript', 'TypeScript', 'JSX', 'TSX'].map(lang => (
                      <Badge key={lang} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Alert title="No AI Required" intent="info">
                This analysis uses pattern matching and heuristics. No external AI APIs needed.
              </Alert>
            </div>
          </div>
        </Container>
      </Page>
    </div>
  )
}
