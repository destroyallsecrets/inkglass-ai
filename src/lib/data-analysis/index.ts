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

export interface RegressionResult {
  slope: number
  intercept: number
  rSquared: number
  predictions: { x: number; y: number }[]
  equation: string
}

export interface OutlierResult {
  outliers: { index: number; value: number; zScore: number }[]
  lowerBound: number
  upperBound: number
  method: 'iqr' | 'zscore'
}

export interface TrendResult {
  direction: 'upward' | 'downward' | 'stable'
  slope: number
  strength: 'strong' | 'moderate' | 'weak' | 'none'
  correlation: number
}

export interface ForecastResult {
  predictions: { period: number; value: number; lower: number; upper: number }[]
  method: string
  confidence: number
}

export interface MovingAverageResult {
  period: number
  values: { index: number; original: number; movingAvg: number }[]
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

export function linearRegression(values: number[]): RegressionResult {
  const n = values.length
  if (n < 2) {
    return { slope: 0, intercept: values[0] || 0, rSquared: 0, predictions: [], equation: 'y = 0' }
  }
  
  const xValues = values.map((_, i) => i + 1)
  
  const sumX = xValues.reduce((a, b) => a + b, 0)
  const sumY = values.reduce((a, b) => a + b, 0)
  const sumXY = xValues.reduce((acc, x, i) => acc + x * values[i], 0)
  const sumX2 = xValues.reduce((acc, x) => acc + x * x, 0)
  const sumY2 = values.reduce((acc, y) => acc + y * y, 0)
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  const meanY = sumY / n
  const ssTotal = values.reduce((acc, y) => acc + Math.pow(y - meanY, 2), 0)
  const ssResidual = values.reduce((acc, y, i) => {
    const predicted = slope * xValues[i] + intercept
    return acc + Math.pow(y - predicted, 2)
  }, 0)
  const rSquared = ssTotal > 0 ? 1 - ssResidual / ssTotal : 0
  
  const predictions = values.map((_, i) => ({
    x: xValues[i],
    y: slope * xValues[i] + intercept,
  }))
  
  const sign = slope >= 0 ? '+' : '-'
  const slopeStr = Math.abs(slope).toFixed(4)
  const interceptStr = Math.abs(intercept).toFixed(4)
  const equation = `y = ${slopeStr}x ${sign} ${interceptStr}`
  
  return {
    slope: Math.round(slope * 10000) / 10000,
    intercept: Math.round(intercept * 10000) / 10000,
    rSquared: Math.round(rSquared * 1000) / 1000,
    predictions,
    equation,
  }
}

export function detectOutliersIQR(values: number[]): OutlierResult {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  
  const q1Index = Math.floor(n * 0.25)
  const q3Index = Math.floor(n * 0.75)
  const q1 = sorted[q1Index]
  const q3 = sorted[q3Index]
  const iqr = q3 - q1
  
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr
  
  const outliers: OutlierResult['outliers'] = []
  values.forEach((value, index) => {
    if (value < lowerBound || value > upperBound) {
      outliers.push({
        index,
        value,
        zScore: 0,
      })
    }
  })
  
  return {
    outliers,
    lowerBound: Math.round(lowerBound * 100) / 100,
    upperBound: Math.round(upperBound * 100) / 100,
    method: 'iqr',
  }
}

export function detectOutliersZScore(values: number[], threshold: number = 3): OutlierResult {
  const stats = calculateStats(values)
  const mean = stats.mean
  const std = stats.stdDev
  
  const outliers: OutlierResult['outliers'] = []
  values.forEach((value, index) => {
    const zScore = (value - mean) / std
    if (Math.abs(zScore) > threshold) {
      outliers.push({
        index,
        value,
        zScore: Math.round(zScore * 100) / 100,
      })
    }
  })
  
  const lowerBound = mean - threshold * std
  const upperBound = mean + threshold * std
  
  return {
    outliers,
    lowerBound: Math.round(lowerBound * 100) / 100,
    upperBound: Math.round(upperBound * 100) / 100,
    method: 'zscore',
  }
}

export function detectTrend(values: number[]): TrendResult {
  if (values.length < 2) {
    return { direction: 'stable', slope: 0, strength: 'none', correlation: 0 }
  }
  
  const regression = linearRegression(values)
  
  let direction: TrendResult['direction']
  if (regression.slope > 0.1) direction = 'upward'
  else if (regression.slope < -0.1) direction = 'downward'
  else direction = 'stable'
  
  let strength: TrendResult['strength']
  const absR = Math.abs(regression.rSquared)
  if (absR > 0.7) strength = 'strong'
  else if (absR > 0.4) strength = 'moderate'
  else if (absR > 0.2) strength = 'weak'
  else strength = 'none'
  
  return {
    direction,
    slope: regression.slope,
    strength,
    correlation: Math.round(Math.sqrt(regression.rSquared) * 100) / 100,
  }
}

export function calculateMovingAverage(values: number[], period: number): MovingAverageResult {
  if (values.length < period) {
    return { period, values: values.map((v, i) => ({ index: i, original: v, movingAvg: v })) }
  }
  
  const result: MovingAverageResult['values'] = []
  
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push({ index: i, original: values[i], movingAvg: values[i] })
    } else {
      let sum = 0
      for (let j = 0; j < period; j++) {
        sum += values[i - j]
      }
      const movingAvg = sum / period
      result.push({ index: i, original: values[i], movingAvg: Math.round(movingAvg * 100) / 100 })
    }
  }
  
  return { period, values: result }
}

export function forecast(values: number[], periods: number = 5, confidence: number = 0.95): ForecastResult {
  const regression = linearRegression(values)
  
  const predictions: ForecastResult['predictions'] = []
  const n = values.length
  
  const se = Math.sqrt(
    values.reduce((acc, y, i) => {
      const predicted = regression.slope * (i + 1) + regression.intercept
      return acc + Math.pow(y - predicted, 2)
    }, 0) / (n - 2)
  )
  
  const tValue = 2.0
  
  for (let i = 1; i <= periods; i++) {
    const x = n + i
    const y = regression.slope * x + regression.intercept
    const margin = tValue * se * Math.sqrt(1 + 1 / n + Math.pow(x - (n + 1) / 2, 2) / (n * (n + 1) * (n - 1) / 12))
    
    predictions.push({
      period: i,
      value: Math.round(y * 100) / 100,
      lower: Math.round((y - margin) * 100) / 100,
      upper: Math.round((y + margin) * 100) / 100,
    })
  }
  
  return {
    predictions,
    method: 'Linear Regression',
    confidence: confidence * 100,
  }
}

export function normalizeMinMax(values: number[]): number[] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min
  
  if (range === 0) return values.map(() => 0.5)
  
  return values.map(v => Math.round(((v - min) / range) * 10000) / 10000)
}

export function normalizeZScore(values: number[]): { normalized: number[]; mean: number; stdDev: number } {
  const stats = calculateStats(values)
  
  return {
    normalized: values.map(v => Math.round(((v - stats.mean) / stats.stdDev) * 10000) / 10000),
    mean: Math.round(stats.mean * 100) / 100,
    stdDev: Math.round(stats.stdDev * 100) / 100,
  }
}

export function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length < 2) return 0
  
  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0)
  const sumX2 = x.reduce((acc, x) => acc + x * x, 0)
  const sumY2 = y.reduce((acc, y) => acc + y * y, 0)
  
  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  
  return denominator === 0 ? 0 : Math.round((numerator / denominator) * 1000) / 1000
}

export function calculateCorrelationMatrix(data: Record<string, number[]>): Record<string, Record<string, number>> {
  const columns = Object.keys(data)
  const matrix: Record<string, Record<string, number>> = {}
  
  for (const col1 of columns) {
    matrix[col1] = {}
    for (const col2 of columns) {
      if (col1 === col2) {
        matrix[col1][col2] = 1
      } else {
        matrix[col1][col2] = calculateCorrelation(data[col1], data[col2])
      }
    }
  }
  
  return matrix
}
