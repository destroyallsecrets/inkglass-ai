export interface DataPoint {
  label: string
  value: number
}

export interface DataStats {
  count: number
  sum: number
  mean: number
  median: number
  mode: number[]
  stdDev: number
  min: number
  max: number
  range: number
}

export interface ParsedData {
  headers: string[]
  rows: (string | number)[][]
  numericColumns: number[]
  stats: Record<string, DataStats>
}

export function parseCSV(csvText: string): ParsedData {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''))
  
  const rows: (string | number)[][] = []
  let numericColumns: number[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => {
      const trimmed = v.trim().replace(/^["']|["']$/g, '')
      const num = parseFloat(trimmed)
      return isNaN(num) ? trimmed : num
    })
    rows.push(values)
  }

  if (rows.length > 0) {
    numericColumns = headers.map((_, colIndex) => {
      const isNumeric = rows.every(row => typeof row[colIndex] === 'number')
      return isNumeric ? colIndex : -1
    }).filter(i => i !== -1)
  }

  const stats: Record<string, DataStats> = {}
  for (const colIndex of numericColumns) {
    const values = rows.map(row => row[colIndex] as number)
    stats[headers[colIndex]] = calculateStats(values)
  }

  return { headers, rows, numericColumns, stats }
}

export function calculateStats(values: number[]): DataStats {
  const sorted = [...values].sort((a, b) => a - b)
  const sum = values.reduce((acc, val) => acc + val, 0)
  const count = values.length
  const mean = sum / count

  const median = count % 2 === 0
    ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
    : sorted[Math.floor(count / 2)]

  const mode = calculateMode(values)
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count
  const stdDev = Math.sqrt(variance)

  return {
    count,
    sum,
    mean,
    median,
    mode,
    stdDev,
    min: sorted[0],
    max: sorted[count - 1],
    range: sorted[count - 1] - sorted[0],
  }
}

function calculateMode(values: number[]): number[] {
  const frequency: Record<number, number> = {}
  values.forEach(val => {
    frequency[val] = (frequency[val] || 0) + 1
  })
  
  const maxFreq = Math.max(...Object.values(frequency))
  if (maxFreq === 1) return []
  
  return Object.entries(frequency)
    .filter(([_, freq]) => freq === maxFreq)
    .map(([val]) => parseFloat(val))
}

export function parseJSON(jsonText: string): ParsedData {
  const data = JSON.parse(jsonText)
  
  if (!Array.isArray(data)) {
    throw new Error('JSON must be an array')
  }

  if (data.length === 0) {
    return { headers: [], rows: [], numericColumns: [], stats: {} }
  }

  const headers = Object.keys(data[0])
  const rows = data.map(obj => headers.map(h => obj[h]))
  
  const numericColumns = headers.map((_, colIndex) => {
    const isNumeric = rows.every(row => typeof row[colIndex] === 'number' || row[colIndex] === null)
    return isNumeric ? colIndex : -1
  }).filter(i => i !== -1)

  const stats: Record<string, DataStats> = {}
  for (const colIndex of numericColumns) {
    const values = rows.map(row => row[colIndex] as number).filter(v => v !== null)
    stats[headers[colIndex]] = calculateStats(values)
  }

  return { headers, rows, numericColumns, stats }
}

export function generateSampleData(rows: number = 10): DataPoint[] {
  const data: DataPoint[] = []
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  for (let i = 0; i < Math.min(rows, 12); i++) {
    data.push({
      label: labels[i % labels.length],
      value: Math.floor(Math.random() * 100) + 20,
    })
  }
  
  return data
}

export function aggregateData(data: DataPoint[], type: 'sum' | 'avg' | 'min' | 'max'): number {
  if (data.length === 0) return 0
  
  switch (type) {
    case 'sum':
      return data.reduce((acc, d) => acc + d.value, 0)
    case 'avg':
      return data.reduce((acc, d) => acc + d.value, 0) / data.length
    case 'min':
      return Math.min(...data.map(d => d.value))
    case 'max':
      return Math.max(...data.map(d => d.value))
    default:
      return 0
  }
}
