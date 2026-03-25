'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Sidebar } from '@/components/layout'
import { Container } from '@/components/layout'
import { Header, Page, Section } from '@/components/layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Textarea,
  Badge,
  Modal,
  Alert,
} from '@/components/ui'
import {
  Code,
  Plus,
  Search,
  Copy,
  Check,
  Trash2,
  Edit3,
  Save,
  Download,
  Upload,
  Tag,
  FolderOpen,
  Clock,
  X,
  FileCode,
  Bookmark,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getSnippets,
  saveSnippet,
  updateSnippet,
  deleteSnippet,
  searchSnippets,
  getAllTags,
  getAllLanguages,
  exportSnippets,
  importSnippets,
  type CodeSnippet,
} from '@/lib/snippets'

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'rust', 'go', 'java', 'csharp', 
  'cpp', 'ruby', 'php', 'swift', 'kotlin', 'sql', 'bash', 'html', 'css', 'other'
]

const PRESET_TAGS = ['utility', 'component', 'api', 'database', 'config', 'algorithm', 'snippet']

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [search, setSearch] = useState('')
  const [filterLanguage, setFilterLanguage] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | null>(null)
  
  const [formTitle, setFormTitle] = useState('')
  const [formCode, setFormCode] = useState('')
  const [formLanguage, setFormLanguage] = useState('javascript')
  const [formTags, setFormTags] = useState('')
  const [formDescription, setFormDescription] = useState('')

  useEffect(() => {
    setSnippets(getSnippets())
  }, [])

  const allTags = useMemo(() => {
    const tags = getAllTags()
    return tags.length > 0 ? tags : PRESET_TAGS
  }, [snippets])

  const allLanguages = useMemo(() => {
    const langs = getAllLanguages()
    return langs.length > 0 ? langs : LANGUAGES
  }, [snippets])

  const filteredSnippets = useMemo(() => {
    let result = snippets
    if (search) result = searchSnippets(search)
    if (filterLanguage) result = result.filter(s => s.language === filterLanguage)
    if (filterTag) result = result.filter(s => s.tags.includes(filterTag))
    return result
  }, [snippets, search, filterLanguage, filterTag])

  const openCreateModal = () => {
    setEditingSnippet(null)
    setFormTitle('')
    setFormCode('')
    setFormLanguage('javascript')
    setFormTags('')
    setFormDescription('')
    setShowModal(true)
  }

  const openEditModal = (snippet: CodeSnippet) => {
    setEditingSnippet(snippet)
    setFormTitle(snippet.title)
    setFormCode(snippet.code)
    setFormLanguage(snippet.language)
    setFormTags(snippet.tags.join(', '))
    setFormDescription(snippet.description || '')
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formTitle.trim() || !formCode.trim()) return
    
    const tags = formTags.split(',').map(t => t.trim()).filter(Boolean)
    
    if (editingSnippet) {
      updateSnippet(editingSnippet.id, {
        title: formTitle.trim(),
        code: formCode,
        language: formLanguage,
        tags,
        description: formDescription.trim() || undefined,
      })
    } else {
      saveSnippet({
        title: formTitle.trim(),
        code: formCode,
        language: formLanguage,
        tags,
        description: formDescription.trim() || undefined,
      })
    }
    
    setSnippets(getSnippets())
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this snippet?')) {
      deleteSnippet(id)
      setSnippets(getSnippets())
    }
  }

  const handleCopy = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExport = () => {
    const data = exportSnippets()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inkglass-snippets-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const text = await file.text()
      const count = importSnippets(text)
      setSnippets(getSnippets())
      alert(`Imported ${count} new snippets`)
    }
    input.click()
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container>
          <Header
            title="Code Snippets"
            subtitle="Save and organize your code snippets"
            actions={
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="sm" onClick={handleImport} className="hidden sm:flex">
                  Import
                </Button>
                <Button variant="ghost" size="sm" onClick={handleImport} className="sm:hidden">
                  <Upload className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleExport} className="hidden sm:flex">
                  Export
                </Button>
                <Button variant="ghost" size="sm" onClick={handleExport} className="sm:hidden">
                  <Download className="w-4 h-4" />
                </Button>
                <Button onClick={openCreateModal} size="sm">
                  <Plus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">New Snippet</span>
                </Button>
              </div>
            }
          />

          <div className="mb-4 sm:mb-6 flex flex-col gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-gray" />
              <input
                type="text"
                placeholder="Search snippets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-ink-cream/50 border border-ink-light/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="flex-1 min-w-[120px] px-3 py-2 bg-ink-cream/50 border border-ink-light/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
              >
                <option value="">Language</option>
                {allLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="flex-1 min-w-[120px] px-3 py-2 bg-ink-cream/50 border border-ink-light/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
              >
                <option value="">Tag</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredSnippets.length === 0 ? (
            <Card variant="paper" padding="lg">
              <CardContent className="text-center py-12">
                <Bookmark className="w-12 h-12 mx-auto text-ink-gray mb-4" />
                <h3 className="text-lg font-medium text-ink-black mb-2">
                  {snippets.length === 0 ? 'No snippets yet' : 'No matching snippets'}
                </h3>
                <p className="text-ink-light mb-4">
                  {snippets.length === 0 
                    ? 'Create your first code snippet to get started'
                    : 'Try adjusting your search or filters'}
                </p>
                {snippets.length === 0 && (
                  <Button onClick={openCreateModal}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Snippet
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredSnippets.map(snippet => (
                <Card key={snippet.id} variant="paper" hover>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <FileCode className="w-4 h-4 text-ink-gray" />
                          {snippet.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" color="default" size="sm">
                            {snippet.language}
                          </Badge>
                          {snippet.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" color="info" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(snippet.code, snippet.id)}
                        >
                          {copiedId === snippet.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(snippet)}>
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(snippet.id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-ink-light/10 p-3 rounded-lg overflow-x-auto font-mono text-xs max-h-40">
                      {snippet.code}
                    </pre>
                    <div className="flex items-center gap-2 mt-3 text-xs text-ink-gray">
                      <Clock className="w-3 h-3" />
                      {formatDate(snippet.updatedAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Page>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSnippet ? 'Edit Snippet' : 'New Snippet'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g., React useDebounce Hook"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Code *</label>
            <textarea
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
              placeholder="Paste your code here..."
              rows={8}
              className="w-full px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select
                value={formLanguage}
                onChange={(e) => setFormLanguage(e.target.value)}
                className="w-full px-4 py-2.5 bg-ink-cream/50 border border-ink-light/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <Input
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="e.g., react, hook, utility"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Optional description..."
              rows={2}
              className="w-full px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formTitle.trim() || !formCode.trim()}>
              <Save className="w-4 h-4 mr-2" />
              {editingSnippet ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
