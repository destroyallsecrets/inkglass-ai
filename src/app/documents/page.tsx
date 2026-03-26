'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/layout'
import { Container } from '@/components/layout'
import { Header, Page, Section } from '@/components/layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Modal,
} from '@/components/ui'
import {
  Search,
  FileText,
  File,
  Image,
  FileCode,
  Download,
  Trash2,
  Star,
  Upload,
  Grid,
  List,
  Eye,
  FileSearch,
} from 'lucide-react'
import { cn, safeJsonParse } from '@/lib/utils'
import {
  extractTextFromFile,
  getDocumentSummary,
  formatFileSize,
  getDocumentType,
  type DocumentInfo,
} from '@/lib/documents'

interface LocalDocument extends DocumentInfo {
  id: string
  text?: string
  starred: boolean
  createdAt: Date
}

const SUPPORTED_TYPES = ['pdf', 'txt', 'md', 'csv', 'json']

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [documents, setDocuments] = useState<LocalDocument[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<LocalDocument | null>(null)
  const [previewText, setPreviewText] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('inkglass-documents')
    if (stored) {
      setDocuments(safeJsonParse<LocalDocument[]>(stored, []))
    }
  }, [])

  const saveDocuments = useCallback((docs: LocalDocument[]) => {
    localStorage.setItem('inkglass-documents', JSON.stringify(docs))
    setDocuments(docs)
  }, [])

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return
    
    setIsUploading(true)
    const newDocs: LocalDocument[] = []

    for (const file of Array.from(files)) {
      const type = getDocumentType(file.name)
      
      if (!SUPPORTED_TYPES.includes(type)) {
        continue
      }

      const doc: LocalDocument = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type || type,
        size: file.size,
        starred: false,
        createdAt: new Date(),
      }

      if (type === 'txt' || type === 'md' || type === 'csv' || type === 'json') {
        doc.text = await file.text()
      } else if (type === 'pdf') {
        setIsExtracting(true)
        doc.text = await extractTextFromFile(file)
        setIsExtracting(false)
      }

      newDocs.push(doc)
    }

    saveDocuments([...documents, ...newDocs])
    setIsUploadModalOpen(false)
    setIsUploading(false)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files)
    }
  }, [documents])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDeleteDocument = (id: string) => {
    saveDocuments(documents.filter((d) => d.id !== id))
    if (selectedDoc?.id === id) {
      setSelectedDoc(null)
    }
  }

  const handleToggleStar = (doc: LocalDocument) => {
    saveDocuments(documents.map((d) =>
      d.id === doc.id ? { ...d, starred: !d.starred } : d
    ))
  }

  const handlePreview = async (doc: LocalDocument) => {
    setSelectedDoc(doc)
    if (!doc.text) {
      setIsExtracting(true)
      const text = await extractTextFromFile({
        name: doc.name,
        type: doc.type,
        size: doc.size,
      } as File)
      setPreviewText(text)
      setIsExtracting(false)
    } else {
      setPreviewText(doc.text)
    }
  }

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFileIcon = (filename: string) => {
    const type = getDocumentType(filename)
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />
      case 'txt':
      case 'md':
        return <FileCode className="w-8 h-8 text-blue-500" />
      case 'csv':
      case 'json':
        return <File className="w-8 h-8 text-green-600" />
      default:
        return <File className="w-8 h-8 text-gray-500" />
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container>
          <Header
            title="Documents"
            subtitle="Upload and analyze your documents"
            actions={
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            }
          />

          <Section>
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-gray" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search documents..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white/50 border border-ink-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    variant="paper"
                    padding="md"
                    hover
                    className="group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-lg bg-ink-light/10 flex items-center justify-center mb-3">
                        {getFileIcon(doc.name)}
                      </div>
                      <h4 className="font-medium text-sm truncate w-full">{doc.name}</h4>
                      <p className="text-xs text-ink-gray mt-1">
                        {formatFileSize(doc.size)}
                      </p>
                      <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => handlePreview(doc)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => handleToggleStar(doc)}
                        >
                          <Star className={cn('w-4 h-4', doc.starred && 'text-yellow-500 fill-yellow-500')} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => handleDeleteDocument(doc.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card variant="paper" padding="none">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-ink-light/20">
                      <th className="text-left p-4 text-sm font-medium text-ink-gray">Name</th>
                      <th className="text-left p-4 text-sm font-medium text-ink-gray">Type</th>
                      <th className="text-left p-4 text-sm font-medium text-ink-gray">Size</th>
                      <th className="text-left p-4 text-sm font-medium text-ink-gray">Words</th>
                      <th className="text-right p-4 text-sm font-medium text-ink-gray">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <tr
                        key={doc.id}
                        className="border-b border-ink-light/10 hover:bg-ink-light/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.name)}
                            <span className="font-medium">{doc.name}</span>
                            {doc.starred && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-ink-gray uppercase">{getDocumentType(doc.name)}</td>
                        <td className="p-4 text-ink-gray">{formatFileSize(doc.size)}</td>
                        <td className="p-4 text-ink-gray">
                          {doc.text ? getDocumentSummary(doc.text).words : '-'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handlePreview(doc)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleToggleStar(doc)}
                            >
                              <Star className={cn('w-4 h-4', doc.starred && 'text-yellow-500 fill-yellow-500')} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-ink-gray">
                Showing {filteredDocuments.length} of {documents.length} documents
              </span>
            </div>
          </Section>
        </Container>
      </Page>

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Document"
      >
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
            dragActive ? "border-ink-black bg-ink-light/10" : "border-ink-light/30"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragActive(false)}
        >
          <Upload className="w-12 h-12 mx-auto text-ink-gray mb-4" />
          <p className="text-ink-gray mb-4">
            Drag and drop files here, or click to browse
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.txt,.md,.csv,.json"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="inline-flex items-center justify-center px-4 py-2 bg-ink-light/50 hover:bg-ink-light/70 border border-ink-light/30 rounded-lg text-sm font-medium transition-colors">
              Browse Files
            </span>
          </label>
          <p className="text-xs text-ink-light mt-4">
            Supported: PDF, TXT, MD, CSV, JSON
          </p>
        </div>
        {isUploading && (
          <p className="text-center text-ink-gray mt-4">
            {isExtracting ? 'Extracting text...' : 'Uploading...'}
          </p>
        )}
      </Modal>

      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.name || 'Document Preview'}
      >
        {isExtracting ? (
          <div className="text-center py-8">
            <p className="text-ink-gray">Extracting text...</p>
          </div>
        ) : previewText ? (
          <div className="space-y-4">
            {selectedDoc?.text && (
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="p-2 bg-ink-light/10 rounded text-center">
                  <p className="text-ink-gray">Words</p>
                  <p className="font-bold">{getDocumentSummary(previewText).words}</p>
                </div>
                <div className="p-2 bg-ink-light/10 rounded text-center">
                  <p className="text-ink-gray">Chars</p>
                  <p className="font-bold">{getDocumentSummary(previewText).characters}</p>
                </div>
                <div className="p-2 bg-ink-light/10 rounded text-center">
                  <p className="text-ink-gray">Sentences</p>
                  <p className="font-bold">{getDocumentSummary(previewText).sentences}</p>
                </div>
                <div className="p-2 bg-ink-light/10 rounded text-center">
                  <p className="text-ink-gray">Reading</p>
                  <p className="font-bold">{getDocumentSummary(previewText).readingTime}m</p>
                </div>
              </div>
            )}
            <div className="max-h-96 overflow-y-auto p-4 bg-ink-light/10 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {previewText.substring(0, 2000)}
                {previewText.length > 2000 && '...'}
              </pre>
            </div>
          </div>
        ) : (
          <p className="text-center text-ink-gray">No preview available</p>
        )}
      </Modal>
    </div>
  )
}
