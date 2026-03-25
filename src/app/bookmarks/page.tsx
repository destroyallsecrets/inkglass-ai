'use client'

import React, { useState, useEffect } from 'react'
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
import {
  Bookmark,
  Search,
  Trash2,
  Copy,
  Check,
  Tag,
  Clock,
  Plus,
  HelpCircle,
  Lightbulb,
  Star,
  FileText,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import api from '@/lib/api'

export default function BookmarksPage() {
  const { token } = useAuth()
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [showDocs, setShowDocs] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newBookmark, setNewBookmark] = useState({ title: '', content: '', type: 'response' })

  useEffect(() => {
    if (token) {
      loadBookmarks()
    } else {
      setIsLoading(false)
    }
  }, [token])

  const loadBookmarks = async () => {
    setIsLoading(true)
    try {
      const data = await api.bookmarks.getAll(token!)
      setBookmarks(data)
    } catch (error) {
      console.error('Failed to load bookmarks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDelete = async (id: string) => {
    try {
      await api.bookmarks.delete(token!, id)
      setBookmarks((prev) => prev.filter((b) => b.id !== id))
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const handleAdd = async () => {
    if (!newBookmark.title || !newBookmark.content) return
    try {
      const created = await api.bookmarks.create(token!, newBookmark)
      setBookmarks((prev) => [created, ...prev])
      setNewBookmark({ title: '', content: '', type: 'response' })
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to create bookmark:', error)
    }
  }

  const filteredBookmarks = bookmarks.filter((bookmark) =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.content?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'code':
        return <Sparkles className="w-4 h-4" />
      case 'document':
        return <FileText className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container className="max-w-5xl">
          <Header
            title="Bookmarks"
            subtitle="Save and organize important responses"
            actions={
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setShowDocs(!showDocs)}>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {showDocs ? 'Hide Docs' : 'Show Docs'}
                </Button>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bookmark
                </Button>
              </div>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={cn("space-y-6", showDocs ? "lg:col-span-2" : "lg:col-span-3")}>
              <Card variant="paper" padding="lg">
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-gray" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search bookmarks..."
                      className="w-full pl-10 pr-4 py-2 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
                    />
                  </div>
                </CardContent>
              </Card>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full border-4 border-ink-black border-t-transparent animate-spin mx-auto mb-4" />
                  <p className="text-ink-gray">Loading bookmarks...</p>
                </div>
              ) : filteredBookmarks.length === 0 ? (
                <Card variant="paper" padding="lg">
                  <CardContent className="text-center py-12">
                    <Bookmark className="w-16 h-16 text-ink-gray mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No bookmarks yet</h3>
                    <p className="text-ink-gray mb-4">
                      Save important responses to access them quickly later
                    </p>
                    <Button onClick={() => setShowAddModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Bookmark
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBookmarks.map((bookmark) => (
                    <Card key={bookmark.id} variant="paper" padding="md" hover>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-ink-light/10 flex items-center justify-center">
                            {getTypeIcon(bookmark.type)}
                          </div>
                          <div>
                            <h3 className="font-medium">{bookmark.title}</h3>
                            {bookmark.tags && (
                              <div className="flex gap-1 mt-1">
                                {JSON.parse(bookmark.tags).map((tag: string) => (
                                  <span key={tag} className="px-2 py-0.5 text-xs bg-ink-light/10 rounded-full text-ink-gray">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleCopy(bookmark.content, bookmark.id)}
                          >
                            {copied === bookmark.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(bookmark.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-ink-gray line-clamp-3">
                        {bookmark.content}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-ink-light">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(bookmark.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {showDocs && (
              <div className="space-y-6">
                <Card variant="ink" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Lightbulb className="w-5 h-5" />
                      About Bookmarks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-ink-light">
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Save important AI responses for later</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Organize with tags</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Quick copy to clipboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Search through saved content</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Tag className="w-5 h-5" />
                      Suggested Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {['code', 'writing', 'analysis', 'reference', 'important'].map((tag) => (
                        <button
                          key={tag}
                          className="px-3 py-1 text-sm bg-ink-light/10 rounded-full text-ink-gray hover:bg-ink-light/20 transition-colors capitalize"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Alert title="Organization Tips" intent="info">
                  <p className="text-sm text-ink-light mt-1">
                    Use consistent tags to organize your bookmarks. 
                    Add tags when saving to keep things organized.
                  </p>
                </Alert>
              </div>
            )}
          </div>

          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card variant="glass" padding="lg" className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle>Add Bookmark</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        value={newBookmark.title}
                        onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                        placeholder="Bookmark title"
                        className="w-full px-4 py-2 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Content</label>
                      <textarea
                        value={newBookmark.content}
                        onChange={(e) => setNewBookmark({ ...newBookmark, content: e.target.value })}
                        placeholder="Content to save"
                        rows={4}
                        className="w-full px-4 py-2 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30 resize-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleAdd} className="flex-1">
                        Save Bookmark
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </Container>
      </Page>
    </div>
  )
}
