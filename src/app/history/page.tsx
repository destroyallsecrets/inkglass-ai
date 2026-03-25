'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
  History,
  Search,
  Trash2,
  MessageSquare,
  Star,
  Clock,
  Calendar,
  Filter,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Lightbulb,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth'
import api from '@/lib/api'

export default function HistoryPage() {
  const { token } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [showDocs, setShowDocs] = useState(true)

  useEffect(() => {
    if (token) {
      loadHistory()
    } else {
      setIsLoading(false)
    }
  }, [token])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const data = await api.chat.getSessions(token!)
      setSessions(data)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.chat.deleteSession(token!, id)
      setSessions((prev) => prev.filter((s) => s.id !== id))
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    const sessionDate = new Date(session.updated_at)
    const now = new Date()
    
    switch (filter) {
      case 'today':
        return sessionDate.toDateString() === now.toDateString()
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7))
        return sessionDate >= weekAgo
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
        return sessionDate >= monthAgo
      default:
        return true
    }
  })

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container className="max-w-5xl">
          <Header
            title="History"
            subtitle="Browse your past conversations"
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
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-gray" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-4 py-2 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
                      />
                    </div>
                    <div className="flex gap-2">
                      {(['all', 'today', 'week', 'month'] as const).map((f) => (
                        <Button
                          key={f}
                          variant={filter === f ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => setFilter(f)}
                        >
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Button>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" onClick={loadHistory}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full border-4 border-ink-black border-t-transparent animate-spin mx-auto mb-4" />
                  <p className="text-ink-gray">Loading history...</p>
                </div>
              ) : filteredSessions.length === 0 ? (
                <Card variant="paper" padding="lg">
                  <CardContent className="text-center py-12">
                    <History className="w-16 h-16 text-ink-gray mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No conversations found</h3>
                    <p className="text-ink-gray mb-4">
                      {searchQuery ? 'Try a different search term' : 'Start chatting to see your history here'}
                    </p>
                    <Link href="/chat">
                      <Button>Start New Chat</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredSessions.map((session) => (
                    <Card key={session.id} variant="paper" padding="md" hover>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-4 h-4 text-ink-gray" />
                            {session.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <h3 className="font-medium truncate">{session.title}</h3>
                          <p className="text-sm text-ink-gray mt-1">
                            {session.message_count || 0} messages
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-ink-light">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(session.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/chat?session=${session.id}`}>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(session.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
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
                      About History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-ink-light">
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>All conversations are automatically saved</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Star important chats for quick access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Search by title or content</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Filter by date range</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Calendar className="w-5 h-5" />
                      Quick Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <button
                        onClick={() => setFilter('today')}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                          filter === 'today' ? "bg-ink-black text-ink-paper" : "hover:bg-ink-light/10"
                        )}
                      >
                        Today
                      </button>
                      <button
                        onClick={() => setFilter('week')}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                          filter === 'week' ? "bg-ink-black text-ink-paper" : "hover:bg-ink-light/10"
                        )}
                      >
                        This Week
                      </button>
                      <button
                        onClick={() => setFilter('month')}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                          filter === 'month' ? "bg-ink-black text-ink-paper" : "hover:bg-ink-light/10"
                        )}
                      >
                        This Month
                      </button>
                      <button
                        onClick={() => setFilter('all')}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                          filter === 'all' ? "bg-ink-black text-ink-paper" : "hover:bg-ink-light/10"
                        )}
                      >
                        All Time
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Alert title="Retention Policy" intent="info">
                  <p className="text-sm text-ink-light mt-1">
                    Conversations are stored for 30 days in demo mode. 
                    Full accounts have extended storage.
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
