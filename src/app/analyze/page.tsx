'use client'

import React, { useState, useRef, useMemo } from 'react'
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
  BarChart3,
  Upload,
  Download,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  Keyboard,
  Table,
  TrendingUp,
  PieChart,
  Activity,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'
import {
  parseCSV,
  parseJSON,
  calculateStats,
  type ParsedData,
  type DataStats,
} from '@/lib/data-analysis'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const chartTypes = [
  { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { value: 'line', label: 'Line Chart', icon: TrendingUp },
  { value: 'pie', label: 'Pie Chart', icon: PieChart },
  { value: 'table', label: 'Data Table', icon: Table },
]

const colors = [
  'rgba(26, 26, 26, 0.8)',
  'rgba(74, 74, 74, 0.8)',
  'rgba(154, 154, 154, 0.8)',
  'rgba(26, 26, 26, 0.5)',
  'rgba(74, 74, 74, 0.5)',
  'rgba(154, 154, 154, 0.5)',
]

const sampleCSV = `month,sales,users,conversion
Jan,1200,450,3.2
Feb,1900,620,4.1
Mar,1500,510,3.8
Apr,2300,780,4.5
May,2100,710,4.2
Jun,2800,890,5.1
Jul,2400,820,4.8
Aug,2600,870,5.0`

export default function AnalyzePage() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [chartType, setChartType] = useState('bar')
  const [selectedColumn, setSelectedColumn] = useState<string>('')
  const [showDocs, setShowDocs] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sampleData = useMemo(() => parseCSV(sampleCSV), [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      try {
        if (file.name.endsWith('.json')) {
          const data = parseJSON(text)
          setParsedData(data)
          if (data.numericColumns.length > 0) {
            setSelectedColumn(data.headers[data.numericColumns[0]])
          }
        } else {
          const data = parseCSV(text)
          setParsedData(data)
          if (data.numericColumns.length > 0) {
            setSelectedColumn(data.headers[data.numericColumns[0]])
          }
        }
      } catch (error) {
        alert('Failed to parse file. Please check the format.')
      }
    }
    reader.readAsText(file)
  }

  const handleLoadSample = () => {
    setParsedData(sampleData)
    if (sampleData.numericColumns.length > 0) {
      setSelectedColumn(sampleData.headers[sampleData.numericColumns[0]])
    }
  }

  const handleReset = () => {
    setParsedData(null)
    setSelectedColumn('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const chartData = useMemo(() => {
    if (!parsedData || !selectedColumn) return null
    
    const colIndex = parsedData.headers.indexOf(selectedColumn)
    if (colIndex === -1) return null

    const numericData = parsedData.rows
      .map(row => ({ label: String(row[0]), value: Number(row[colIndex]) }))
      .filter(d => !isNaN(d.value))

    if (chartType === 'pie') {
      return {
        labels: numericData.map(d => d.label),
        datasets: [{
          data: numericData.map(d => d.value),
          backgroundColor: colors.slice(0, numericData.length),
          borderColor: 'rgba(26, 26, 26, 1)',
          borderWidth: 1,
        }],
      }
    }

    return {
      labels: numericData.map(d => d.label),
      datasets: [{
        label: selectedColumn,
        data: numericData.map(d => d.value),
        backgroundColor: chartType === 'line' ? 'rgba(26, 26, 26, 0.2)' : colors[0],
        borderColor: 'rgba(26, 26, 26, 1)',
        borderWidth: 2,
        fill: chartType === 'line',
        tension: 0.3,
      }],
    }
  }, [parsedData, selectedColumn, chartType])

  const columnStats: DataStats | null = useMemo(() => {
    if (!parsedData || !selectedColumn) return null
    return parsedData.stats[selectedColumn] || null
  }, [parsedData, selectedColumn])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: chartType === 'pie',
        position: 'bottom' as const,
      },
    },
    scales: chartType === 'pie' ? {} : {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container className="max-w-6xl">
          <Header
            title="Data Analysis"
            subtitle="Upload data and visualize with charts"
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
                  {!parsedData ? (
                    <div className="border-2 border-dashed border-ink-light/30 rounded-xl p-8 text-center">
                      <Upload className="w-12 h-12 mx-auto text-ink-gray mb-4" />
                      <p className="text-ink-gray mb-4">
                        Upload a CSV or JSON file to analyze
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.json"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="flex gap-3 justify-center">
                        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                        <Button variant="ghost" onClick={handleLoadSample}>
                          <Activity className="w-4 h-4 mr-2" />
                          Load Sample
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-ink-gray" />
                          <span className="font-medium">
                            {parsedData.rows.length} rows, {parsedData.headers.length} columns
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleReset}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Clear
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                          label="Data Column"
                          options={parsedData.numericColumns.map(i => ({
                            value: parsedData.headers[i],
                            label: parsedData.headers[i],
                          }))}
                          value={selectedColumn}
                          onChange={setSelectedColumn}
                        />
                        <Select
                          label="Chart Type"
                          options={chartTypes.map(c => ({ value: c.value, label: c.label }))}
                          value={chartType}
                          onChange={setChartType}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {parsedData && selectedColumn && (
                <>
                  {columnStats && (
                    <Card variant="glass" padding="lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          Statistics: {selectedColumn}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-4 bg-ink-light/10 rounded-lg text-center">
                            <p className="text-sm text-ink-gray">Count</p>
                            <p className="text-2xl font-serif font-bold">{columnStats.count}</p>
                          </div>
                          <div className="p-4 bg-ink-light/10 rounded-lg text-center">
                            <p className="text-sm text-ink-gray">Mean</p>
                            <p className="text-2xl font-serif font-bold">{columnStats.mean.toFixed(2)}</p>
                          </div>
                          <div className="p-4 bg-ink-light/10 rounded-lg text-center">
                            <p className="text-sm text-ink-gray">Median</p>
                            <p className="text-2xl font-serif font-bold">{columnStats.median.toFixed(2)}</p>
                          </div>
                          <div className="p-4 bg-ink-light/10 rounded-lg text-center">
                            <p className="text-sm text-ink-gray">Std Dev</p>
                            <p className="text-2xl font-serif font-bold">{columnStats.stdDev.toFixed(2)}</p>
                          </div>
                          <div className="p-4 bg-ink-light/10 rounded-lg text-center">
                            <p className="text-sm text-ink-gray">Min</p>
                            <p className="text-2xl font-serif font-bold">{columnStats.min}</p>
                          </div>
                          <div className="p-4 bg-ink-light/10 rounded-lg text-center">
                            <p className="text-sm text-ink-gray">Max</p>
                            <p className="text-2xl font-serif font-bold">{columnStats.max}</p>
                          </div>
                          <div className="p-4 bg-ink-light/10 rounded-lg text-center">
                            <p className="text-sm text-ink-gray">Range</p>
                            <p className="text-2xl font-serif font-bold">{columnStats.range}</p>
                          </div>
                          <div className="p-4 bg-ink-light/10 rounded-lg text-center">
                            <p className="text-sm text-ink-gray">Sum</p>
                            <p className="text-2xl font-serif font-bold">{columnStats.sum.toFixed(0)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card variant="paper" padding="lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {chartType === 'bar' && <BarChart3 className="w-5 h-5" />}
                          {chartType === 'line' && <TrendingUp className="w-5 h-5" />}
                          {chartType === 'pie' && <PieChart className="w-5 h-5" />}
                          {chartType === 'table' && <Table className="w-5 h-5" />}
                          {chartTypes.find(c => c.value === chartType)?.label}
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {chartType === 'table' ? (
                        <div className="overflow-x-auto max-h-96 overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-ink-light/10 sticky top-0">
                              <tr>
                                {parsedData.headers.map((col) => (
                                  <th key={col} className="px-4 py-2 text-left font-medium text-ink-gray">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {parsedData.rows.map((row, i) => (
                                <tr key={i} className="border-t border-ink-light/10">
                                  {row.map((cell, j) => (
                                    <td key={j} className="px-4 py-2">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="h-80">
                          {chartData && (
                            chartType === 'bar' ? <Bar data={chartData} options={chartOptions} /> :
                            chartType === 'line' ? <Line data={chartData} options={chartOptions} /> :
                            <Pie data={chartData} options={chartOptions} />
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

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
                        <span>Upload CSV or JSON files</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Select a column to visualize</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Choose chart type</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>View statistics and export</span>
                      </li>
                    </ul>
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
                      {['CSV', 'JSON'].map((format) => (
                        <span key={format} className="px-2 py-1 text-xs bg-ink-light/10 rounded-full text-ink-gray">
                          {format}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-ink-gray mt-3">Max file size: 5MB</p>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      Statistics Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span className="text-ink-gray">Mean</span>
                      <span className="text-ink-black">Average value</span>
                      <span className="text-ink-gray">Median</span>
                      <span className="text-ink-black">Middle value</span>
                      <span className="text-ink-gray">Std Dev</span>
                      <span className="text-ink-black">Variation</span>
                      <span className="text-ink-gray">Min/Max</span>
                      <span className="text-ink-black">Range</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </Container>
      </Page>
    </div>
  )
}
