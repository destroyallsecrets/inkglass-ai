'use client'

import React, { useState, useEffect } from 'react'
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
  Pagination,
} from '@/components/ui'
import { useAuth } from '@/lib/auth'
import api from '@/lib/api'
import {
  Search,
  FileText,
  File,
  Image,
  FileCode,
  Download,
  Trash2,
  Star,
  Filter,
  Upload,
  Grid,
  List,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DocumentsPage() {
  const { token } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (token) {
      loadDocuments()
    }
  }, [token])

  const loadDocuments = async () => {
    if (!token) return
    try {
      const data = await api.documents.getAll(token)
      setDocuments(data)
    } catch (error) {
      console.error('Failed to load documents:', error)
    }
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) return
    
    setIsUploading(true)
    const formData = new FormData(e.currentTarget)
    const file = formData.get('file') as File
    const name = formData.get('name') as string || file.name

    try {
      await api.documents.create(token, {
        name: name || file.name,
        type: file.name.split('.').pop() || 'unknown',
        size: file.size,
      })
      await loadDocuments()
      setIsUploadModalOpen(false)
    } catch (error) {
      console.error('Failed to upload document:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteDocument = async (id: string) => {
    if (!token) return
    try {
      await api.documents.delete(token, id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }

  const handleToggleStar = async (doc: any) => {
    if (!token) return
    try {
      await api.documents.update(token, doc.id, {
        starred: doc.starred ? 0 : 1,
      })
      loadDocuments()
    } catch (error) {
      console.error('Failed to toggle star:', error)
    }
  }

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />
      case 'code':
      case 'js':
      case 'ts':
      case 'py':
      case 'md':
        return <FileCode className="w-8 h-8 text-blue-500" />
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <Image className="w-8 h-8 text-green-500" />
      case 'xlsx':
      case 'csv':
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
            subtitle="Manage your files and documents"
            actions={
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            }
          />

          <Section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-gray" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search documents..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white/50 border border-ink-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
                  />
                </div>
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
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
                    className="group cursor-pointer"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-lg bg-ink-light/10 flex items-center justify-center mb-3">
                        {getFileIcon(doc.type)}
                      </div>
                      <h4 className="font-medium text-sm truncate w-full">{doc.name}</h4>
                      <p className="text-xs text-ink-gray mt-1">
                        {(doc.size / 1024).toFixed(1)} KB
                      </p>
                      <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => handleToggleStar(doc)}
                        >
                          <Star className={cn('w-4 h-4', doc.starred && 'text-yellow-500 fill-yellow-500')} />
                        </Button>
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <Download className="w-4 h-4" />
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
                      <th className="text-left p-4 text-sm font-medium text-ink-gray">Modified</th>
                      <th className="text-right p-4 text-sm font-medium text-ink-gray">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <tr
                        key={doc.id}
                        className="border-b border-ink-light/10 hover:bg-ink-light/5 transition-colors cursor-pointer"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.type)}
                            <span className="font-medium">{doc.name}</span>
                            {doc.starred && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-ink-gray uppercase">{doc.type}</td>
                        <td className="p-4 text-ink-gray">{(doc.size / 1024).toFixed(1)} KB</td>
                        <td className="p-4 text-ink-gray">
                          {new Date(doc.updated_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleToggleStar(doc)}
                            >
                              <Star className={cn('w-4 h-4', doc.starred && 'text-yellow-500 fill-yellow-500')} />
                            </Button>
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                              <Download className="w-4 h-4" />
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
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-black mb-2">
              Document Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter document name"
              className="w-full px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-ink-black">
              File
            </label>
            <input
              type="file"
              name="file"
              required
              className="w-full px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isUploading}>
              Upload
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
