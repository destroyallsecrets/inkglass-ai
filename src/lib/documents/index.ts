export interface DocumentInfo {
  name: string
  type: string
  size: number
  pages?: number
  text?: string
  preview?: string
}

export type DocumentType = 'pdf' | 'docx' | 'txt' | 'md' | 'csv' | 'json' | 'unknown'

export function getDocumentType(filename: string): DocumentType {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  
  if (ext === 'pdf') return 'pdf'
  if (ext === 'docx' || ext === 'doc') return 'docx'
  if (ext === 'txt') return 'txt'
  if (ext === 'md') return 'md'
  if (ext === 'csv') return 'csv'
  if (ext === 'json') return 'json'
  return 'unknown'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export async function extractTextFromFile(file: File): Promise<string> {
  const type = getDocumentType(file.name)
  
  if (type === 'txt' || type === 'md' || type === 'csv' || type === 'json') {
    return await file.text()
  }
  
  if (type === 'pdf') {
    return await extractTextFromPDF(file)
  }
  
  if (type === 'docx') {
    return await extractTextFromDocx(file)
  }
  
  return `File type ${type} is not supported for text extraction.`
}

async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + '\n\n'
    }
    
    return fullText.trim() || 'No text content found in PDF.'
  } catch (error) {
    console.error('PDF extraction error:', error)
    return 'Failed to extract text from PDF.'
  }
}

async function extractTextFromDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const text = await extractDocxText(arrayBuffer)
    return text
  } catch (error) {
    console.error('DOCX extraction error:', error)
    return 'Failed to extract text from DOCX. Consider converting to PDF.'
  }
}

async function extractDocxText(arrayBuffer: ArrayBuffer): Promise<string> {
  const uint8Array = new Uint8Array(arrayBuffer)
  const textParts: string[] = []
  
  const extracted = await extractTextFromDocxModern(uint8Array)
  return extracted
}

async function extractTextFromDocxModern(uint8Array: Uint8Array): Promise<string> {
  const CMAP_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/cmaps/'
  
  try {
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    
    return 'DOCX text extraction requires additional libraries. Please use a PDF version of your document for best results.'
  } catch {
    return 'DOCX extraction not available. Please convert to PDF.'
  }
}

export function generatePreview(text: string, maxLength: number = 500): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length
}

export function countCharacters(text: string): number {
  return text.replace(/\s/g, '').length
}

export function getDocumentSummary(text: string) {
  const words = countWords(text)
  const chars = countCharacters(text)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length
  
  return {
    words,
    characters: chars,
    sentences,
    paragraphs,
    readingTime: Math.ceil(words / 200),
  }
}

export function searchInDocument(text: string, query: string): number[] {
  const lines = text.split('\n')
  const matchingLines: number[] = []
  
  const lowerQuery = query.toLowerCase()
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes(lowerQuery)) {
      matchingLines.push(index + 1)
    }
  })
  
  return matchingLines
}
