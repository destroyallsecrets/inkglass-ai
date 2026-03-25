'use client'

import React, { useState, useCallback } from 'react'
import { Sidebar } from '@/components/layout'
import { Container } from '@/components/layout'
import { Header, Page } from '@/components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Tabs } from '@/components/ui'
import { 
  FileText, TrendingUp, Tag, BarChart3, Sun, Moon, AlertCircle, CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  analyzeReadability,
  analyzeSentiment,
  extractKeywords,
  getTextStatistics,
  summarizeText,
  detectPassiveVoice,
  type ReadabilityResult,
  type SentimentResult,
  type KeywordResult,
  type TextStatistics,
  type SummarizationResult
} from '@/lib/text-analysis'

const READABILITY_COLORS: Record<string, string> = {
  'Elementary': 'text-green-600 bg-green-100',
  'Middle School': 'text-blue-600 bg-blue-100',
  'High School': 'text-yellow-600 bg-yellow-100',
  'College': 'text-orange-600 bg-orange-100',
  'Graduate': 'text-red-600 bg-red-100',
}

const SENTIMENT_COLORS: Record<string, string> = {
  positive: 'text-green-600 bg-green-100',
  negative: 'text-red-600 bg-red-100',
  neutral: 'text-gray-600 bg-gray-100',
}

export default function TextAnalysisPage() {
  const [text, setText] = useState(`The quick brown fox jumps over the lazy dog. This famous pangram contains every letter of the English alphabet at least once. Pangrams are often used to display typefaces, test keyboards, and practice handwriting.

Writing clear and readable content is essential for effective communication. Good readability scores indicate that your text can be easily understood by your target audience. The best writing is simple, direct, and engaging.

Whether you're writing emails, reports, or creative content, understanding the readability of your text helps you connect with readers. Tools like this one can help you analyze and improve your writing.`)

  const [readability, setReadability] = useState<ReadabilityResult | null>(null)
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null)
  const [keywords, setKeywords] = useState<KeywordResult[]>([])
  const [stats, setStats] = useState<TextStatistics | null>(null)
  const [summary, setSummary] = useState<SummarizationResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = useCallback(() => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setReadability(analyzeReadability(text))
      setSentiment(analyzeSentiment(text))
      setKeywords(extractKeywords(text, 15))
      setStats(getTextStatistics(text))
      setSummary(summarizeText(text, 3))
      setIsAnalyzing(false)
    }, 500)
  }, [text])

  const handleClear = () => {
    setText('')
    setReadability(null)
    setSentiment(null)
    setKeywords([])
    setStats(null)
    setSummary(null)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container>
          <Header
            title="Text Analysis"
            subtitle="Analyze readability, sentiment, keywords, and more"
            actions={
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleClear}>
                  Clear
                </Button>
                <Button onClick={handleAnalyze} disabled={isAnalyzing || !text.trim()}>
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
                </Button>
              </div>
            }
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            <div className="xl:col-span-2 space-y-4 lg:space-y-6">
              <Card variant="paper" padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5" />
                    Your Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-3 bg-ink-light/10 border border-ink-light/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium resize-none"
                    placeholder="Paste or type your text here..."
                  />
                  {stats && (
                    <div className="flex gap-4 mt-3 text-sm text-ink-gray">
                      <span>{stats.words} words</span>
                      <span>{stats.sentences} sentences</span>
                      <span>{stats.characters} characters</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {readability && sentiment && (
                <Card variant="glass" padding="lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Analysis Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs
                      tabs={[
                        {
                          id: 'readability',
                          label: 'Readability',
                          icon: <FileText className="w-4 h-4" />,
                          content: (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="text-center p-4 bg-ink-light/10 rounded-lg">
                                  <div className="text-2xl font-bold">{readability.averageGradeLevel}</div>
                                  <div className="text-xs text-ink-gray mt-1">Grade Level</div>
                                </div>
                                <div className="text-center p-4 bg-ink-light/10 rounded-lg">
                                  <span className={cn(
                                    "inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border",
                                    READABILITY_COLORS[readability.gradeLabel]
                                  )}>
                                    {readability.gradeLabel}
                                  </span>
                                  <div className="text-xs text-ink-gray mt-1">Difficulty</div>
                                </div>
                                <div className="text-center p-4 bg-ink-light/10 rounded-lg">
                                  <div className="text-2xl font-bold">{readability.fleschReadingEase}</div>
                                  <div className="text-xs text-ink-gray mt-1">Reading Ease</div>
                                </div>
                                <div className="text-center p-4 bg-ink-light/10 rounded-lg">
                                  <div className="text-2xl font-bold">{readability.avgWordsPerSentence}</div>
                                  <div className="text-xs text-ink-gray mt-1">Words/Sentence</div>
                                </div>
                              </div>
                              
                              <div className="border-t border-ink-light/20 pt-4">
                                <h4 className="text-sm font-medium mb-3">Score Breakdown</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-ink-gray">Flesch-Kincaid Grade:</span>
                                    <span className="font-medium">{readability.fleschKincaidGrade}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-ink-gray">SMOG Index:</span>
                                    <span className="font-medium">{readability.smogIndex}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-ink-gray">Coleman-Liau Index:</span>
                                    <span className="font-medium">{readability.colemanLiauIndex}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-ink-gray">Automated Readability:</span>
                                    <span className="font-medium">{readability.automatedReadabilityIndex}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="border-t border-ink-light/20 pt-4">
                                <h4 className="text-sm font-medium mb-3">Reading</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-ink-gray">Syllables:</span>
                                    <span className="font-medium">{readability.syllableCount}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-ink-gray">Avg Syllables/Word:</span>
                                    <span className="font-medium">{readability.avgSyllablesPerWord}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        },
                        {
                          id: 'sentiment',
                          label: 'Sentiment',
                          icon: <TrendingUp className="w-4 h-4" />,
                          content: (
                            <div className="space-y-4">
                              <div className="text-center p-6 bg-ink-light/10 rounded-lg">
                                <span className={cn('text-lg px-4 py-1 font-medium rounded-full', SENTIMENT_COLORS[sentiment.label])}>
                                  {sentiment.label.toUpperCase()}
                                </span>
                                <div className="mt-4">
                                  <div className="text-4xl font-bold">{Math.abs(sentiment.score * 100).toFixed(0)}%</div>
                                  <div className="text-sm text-ink-gray mt-1">
                                    {sentiment.score >= 0 ? 'Positive' : 'Negative'} Score
                                  </div>
                                </div>
                                <div className="mt-4 text-sm text-ink-gray">
                                  Confidence: {(sentiment.confidence * 100).toFixed(0)}%
                                </div>
                              </div>

                              {sentiment.positiveWords.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" /> Positive Words
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {sentiment.positiveWords.map(word => (
                                      <Badge key={word} variant="outline" color="success">{word}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {sentiment.negativeWords.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-500" /> Negative Words
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {sentiment.negativeWords.map(word => (
                                      <Badge key={word} variant="outline" color="error">{word}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ),
                        },
                        {
                          id: 'keywords',
                          label: 'Keywords',
                          icon: <Tag className="w-4 h-4" />,
                          content: (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                {keywords.map((kw, i) => (
                                  <div key={kw.word} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-ink-light/20 flex items-center justify-center text-sm font-medium">
                                      {i + 1}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between text-sm">
                                        <span className="font-medium">{kw.word}</span>
                                        <span className="text-ink-gray">{kw.frequency}x</span>
                                      </div>
                                      <div className="mt-1 h-2 bg-ink-light/20 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-ink-black rounded-full transition-all"
                                          style={{ width: `${kw.relevance}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ),
                        },
                        {
                          id: 'summary',
                          label: 'Summary',
                          icon: <BarChart3 className="w-4 h-4" />,
                          content: summary ? (
                            <div className="space-y-4">
                              <div className="p-4 bg-ink-light/10 rounded-lg">
                                <h4 className="text-sm font-medium mb-2">Summary</h4>
                                <p className="text-sm">{summary.summary}</p>
                              </div>

                              <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 bg-ink-light/10 rounded-lg">
                                  <div className="text-xl font-bold">{summary.wordCountOriginal}</div>
                                  <div className="text-xs text-ink-gray">Original Words</div>
                                </div>
                                <div className="text-center p-3 bg-ink-light/10 rounded-lg">
                                  <div className="text-xl font-bold">{summary.wordCountSummary}</div>
                                  <div className="text-xs text-ink-gray">Summary Words</div>
                                </div>
                                <div className="text-center p-3 bg-ink-light/10 rounded-lg">
                                  <div className="text-xl font-bold">{summary.compressionRatio}%</div>
                                  <div className="text-xs text-ink-gray">Compression</div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-2">Key Topics</h4>
                                <div className="flex flex-wrap gap-2">
                                  {summary.keyPoints.map(topic => (
                                    <Badge key={topic} variant="outline">{topic}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : null,
                        },
                        {
                          id: 'stats',
                          label: 'Statistics',
                          icon: <BarChart3 className="w-4 h-4" />,
                          content: stats ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="text-center p-3 bg-ink-light/10 rounded-lg">
                                  <div className="text-xl font-bold">{stats.words}</div>
                                  <div className="text-xs text-ink-gray">Words</div>
                                </div>
                                <div className="text-center p-3 bg-ink-light/10 rounded-lg">
                                  <div className="text-xl font-bold">{stats.sentences}</div>
                                  <div className="text-xs text-ink-gray">Sentences</div>
                                </div>
                                <div className="text-center p-3 bg-ink-light/10 rounded-lg">
                                  <div className="text-xl font-bold">{stats.paragraphs}</div>
                                  <div className="text-xs text-ink-gray">Paragraphs</div>
                                </div>
                                <div className="text-center p-3 bg-ink-light/10 rounded-lg">
                                  <div className="text-xl font-bold">{stats.uniqueWords}</div>
                                  <div className="text-xs text-ink-gray">Unique</div>
                                </div>
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-ink-gray">Characters:</span>
                                  <span className="font-medium">{stats.characters}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-ink-gray">Characters (no spaces):</span>
                                  <span className="font-medium">{stats.charactersNoSpaces}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-ink-gray">Avg Word Length:</span>
                                  <span className="font-medium">{stats.avgWordLength}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-ink-gray">Avg Sentence Length:</span>
                                  <span className="font-medium">{stats.avgSentenceLength}</span>
                                </div>
                              </div>
                            </div>
                          ) : null,
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
                      <FileText className="w-4 h-4" /> Readability
                    </h4>
                    <ul className="text-sm text-ink-gray space-y-1">
                      <li>• Flesch-Kincaid Grade</li>
                      <li>• Reading Ease Score</li>
                      <li>• SMOG Index</li>
                      <li>• Coleman-Liau Index</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Sentiment
                    </h4>
                    <ul className="text-sm text-ink-gray space-y-1">
                      <li>• Positive/Negative detection</li>
                      <li>• Confidence scoring</li>
                      <li>• Word categorization</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Keywords
                    </h4>
                    <ul className="text-sm text-ink-gray space-y-1">
                      <li>• TF-IDF scoring</li>
                      <li>• Frequency analysis</li>
                      <li>• Relevance ranking</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card variant="ink" padding="md">
                <CardHeader>
                  <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-ink-light">
                    This analysis uses mathematical formulas and pattern matching to analyze your text. 
                    No AI APIs required - everything runs locally in your browser.
                  </p>
                </CardContent>
              </Card>

              <Card variant="paper" padding="md">
                <CardHeader>
                  <CardTitle className="text-lg">Grade Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Elementary</span>
                      <span className="text-ink-gray">Grade 1-5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Middle School</span>
                      <span className="text-ink-gray">Grade 6-8</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">High School</span>
                      <span className="text-ink-gray">Grade 9-12</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">College</span>
                      <span className="text-ink-gray">Grade 13-16</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Graduate</span>
                      <span className="text-ink-gray">Grade 17+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Page>
    </div>
  )
}
