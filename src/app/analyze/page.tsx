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
  Progress,
} from '@/components/ui'
import { Select, Toggle } from '@/components/forms'
import {
  BarChart3,
  Upload,
  Download,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  Keyboard,
  BookOpen,
  Sparkles,
  Table,
  TrendingUp,
  PieChart,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const chartTypes = [
  { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { value: 'line', label: 'Line Chart', icon: TrendingUp },
  { value: 'pie', label: 'Pie Chart', icon: PieChart },
  { value: 'table', label: 'Data Table', icon: Table },
]

export default function AnalyzePage() {
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [chartType, setChartType] = useState('bar')
  const [insights, setInsights] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showDocs, setShowDocs] = useState(true)
  const [hasData, setHasData] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sampleData = [
    { month: 'Jan', sales: 1200, users: 450, conversion: 3.2 },
    { month: 'Feb', sales: 1900, users: 620, conversion: 4.1 },
    { month: 'Mar', sales: 1500, users: 510, conversion: 3.8 },
    { month: 'Apr', sales: 2300, users: 780, conversion: 4.5 },
    { month: 'May', sales: 2100, users: 710, conversion: 4.2 },
    { month: 'Jun', sales: 2800, users: 890, conversion: 5.1 },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate CSV parsing
      setData(sampleData)
      setColumns(['month', 'sales', 'users', 'conversion'])
      setHasData(true)
    }
  }

  const handleLoadSample = () => {
    setData(sampleData)
    setColumns(['month', 'sales', 'users', 'conversion'])
    setHasData(true)
  }

  const handleAnalyze = () => {
    if (!data.length) return
    setIsProcessing(true)
    
    setTimeout(() => {
      const analysis = generateAnalysis(data)
      setInsights(analysis)
      setIsProcessing(false)
    }, 2000)
  }

  const handleReset = () => {
    setData([])
    setColumns([])
    setInsights('')
    setHasData(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleExport = (format: string) => {
    alert(`Export as ${format} - Coming soon!`)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container className="max-w-6xl">
          <Header
            title="Data Analysis"
            subtitle="Analyze data and generate insights"
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
                    <Upload className="w-5 h-5" />
                    Upload Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {!hasData ? (
                      <>
                        <div className="border-2 border-dashed border-ink-light/30 rounded-xl p-8 text-center">
                          <Upload className="w-12 h-12 mx-auto text-ink-gray mb-4" />
                          <p className="text-ink-gray mb-4">
                            Upload a CSV file or load sample data
                          </p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <div className="flex gap-3 justify-center">
                            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                              <Upload className="w-4 h-4 mr-2" />
                              Upload CSV
                            </Button>
                            <Button variant="ghost" onClick={handleLoadSample}>
                              <Activity className="w-4 h-4 mr-2" />
                              Load Sample
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Table className="w-5 h-5 text-ink-gray" />
                            <span className="font-medium">{data.length} rows, {columns.length} columns</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={handleReset}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Clear
                          </Button>
                        </div>

                        <div className="overflow-x-auto border border-ink-light/20 rounded-lg">
                          <table className="w-full text-sm">
                            <thead className="bg-ink-light/10">
                              <tr>
                                {columns.map((col) => (
                                  <th key={col} className="px-4 py-2 text-left font-medium text-ink-gray">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {data.slice(0, 10).map((row, i) => (
                                <tr key={i} className="border-t border-ink-light/10">
                                  {columns.map((col) => (
                                    <td key={col} className="px-4 py-2">
                                      {row[col]}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {data.length > 10 && (
                          <p className="text-sm text-ink-gray text-center">
                            Showing first 10 of {data.length} rows
                          </p>
                        )}
                      </>
                    )}

                    {hasData && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <Select
                          label="Visualization Type"
                          options={chartTypes.map(c => ({ value: c.value, label: c.label }))}
                          value={chartType}
                          onChange={(v) => setChartType(v)}
                        />
                        <div className="flex items-end gap-3">
                          <Button 
                            className="flex-1" 
                            onClick={handleAnalyze}
                            isLoading={isProcessing}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Analyze & Visualize
                          </Button>
                          <Button variant="secondary" onClick={() => handleExport('csv')}>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {insights && (
                <Card variant="glass" padding="lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Analysis & Insights
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-ink-light/10 rounded-lg">
                          <p className="text-sm text-ink-gray">Total Records</p>
                          <p className="text-2xl font-serif font-bold">{data.length}</p>
                        </div>
                        <div className="p-4 bg-ink-light/10 rounded-lg">
                          <p className="text-sm text-ink-gray">Avg Sales</p>
                          <p className="text-2xl font-serif font-bold">
                            ${(data.reduce((acc, d) => acc + d.sales, 0) / data.length).toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 bg-ink-light/10 rounded-lg">
                          <p className="text-sm text-ink-gray">Total Users</p>
                          <p className="text-2xl font-serif font-bold">
                            {data.reduce((acc, d) => acc + d.users, 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 bg-ink-light/10 rounded-lg">
                          <p className="text-sm text-ink-gray">Avg Conversion</p>
                          <p className="text-2xl font-serif font-bold">
                            {(data.reduce((acc, d) => acc + d.conversion, 0) / data.length).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Key Findings:</h4>
                        <pre className="whitespace-pre-wrap text-sm bg-transparent p-0 font-sans">
                          {insights}
                        </pre>
                      </div>

                      <div className="p-4 bg-ink-light/10 rounded-lg">
                        <h4 className="font-medium mb-3">Chart Preview ({chartTypes.find(c => c.value === chartType)?.label})</h4>
                        <div className="h-64 flex items-end justify-around gap-2">
                          {data.map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                              <div 
                                className="w-8 bg-ink-black rounded-t"
                                style={{ 
                                  height: `${(d.sales / Math.max(...data.map(d => d.sales))) * 200}px`,
                                  minHeight: '20px'
                                }}
                              />
                              <span className="text-xs text-ink-gray">{d.month}</span>
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
                      Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-ink-light">
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Use clean CSV files with headers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>First column should be labels/categories</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Numerical data works best for charts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Up to 10,000 rows supported</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BarChart3 className="w-5 h-5" />
                      Chart Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {chartTypes.map((chart) => {
                        const Icon = chart.icon
                        return (
                          <div 
                            key={chart.value}
                            className={cn(
                              "flex items-center gap-3 p-2 rounded-lg transition-colors",
                              chartType === chart.value
                                ? "bg-ink-black text-ink-paper"
                                : "hover:bg-ink-light/10"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{chart.label}</span>
                          </div>
                        )
                      })}
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
                      {['CSV', 'TSV', 'JSON'].map((format) => (
                        <span key={format} className="px-2 py-1 text-xs bg-ink-light/10 rounded-full text-ink-gray">
                          {format}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-ink-gray mt-3">Max file size: 5MB</p>
                  </CardContent>
                </Card>

                <Alert title="About Data Analysis" intent="info">
                  <p className="text-sm text-ink-light mt-1">
                    Upload your data to get automated insights, visualizations, 
                    and statistical analysis powered by AI.
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

function generateAnalysis(data: any[]): string {
  const totalSales = data.reduce((acc, d) => acc + (d.sales || 0), 0)
  const avgSales = totalSales / data.length
  const maxSales = Math.max(...data.map(d => d.sales))
  const minSales = Math.min(...data.map(d => d.sales))
  const maxMonth = data.find(d => d.sales === maxSales)?.month
  const minMonth = data.find(d => d.sales === minSales)?.month

  return `## Summary Statistics

- **Total Sales:** ${totalSales.toLocaleString()}
- **Average:** ${avgSales.toLocaleString()} per period
- **Highest:** ${maxSales.toLocaleString()} (${maxMonth})
- **Lowest:** ${minSales.toLocaleString()} (${minMonth})
- **Range:** ${(maxSales - minSales).toLocaleString()} (${(((maxSales - minSales) / minSales * 100)).toFixed(1)}% variation)

## Trends

**Overall Trend:** ${maxSales > avgSales * 1.2 ? 'Upward' : maxSales < avgSales * 0.8 ? 'Downward' : 'Stable'}

The data shows ${maxSales > avgSales * 1.2 ? 'strong positive' : maxSales < avgSales * 0.8 ? 'declining' : 'consistent'} performance across periods.

## Recommendations

1. **Investigate Peak Performance:** The ${maxMonth} spike suggests effective strategies that could be replicated.

2. **Address Underperformance:** ${minMonth} shows room for improvement in this area.

3. **Maintain Consistency:** Focus on reducing variation between periods.

4. **Data-Driven Decisions:** Continue tracking metrics to identify patterns.`
}
