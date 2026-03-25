'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/layout'
import { Page } from '@/components/layout'
import { Button, Card } from '@/components/ui'
import { ChatBubble, PromptInput } from '@/components/ai'
import { useAuth } from '@/lib/auth'
import api from '@/lib/api'
import {
  Plus,
  Search,
  Trash2,
  Star,
  Clock,
  Menu,
  X,
  ChevronLeft,
  MessageSquare,
} from 'lucide-react'
import type { ChatMessage } from '@/types'
import { cn } from '@/lib/utils'

function ChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sessions, setSessions] = useState<any[]>([])
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [showSessions, setShowSessions] = useState(false)

  useEffect(() => {
    if (token) {
      loadSessions()
    }
  }, [token])

  useEffect(() => {
    const sessionId = searchParams.get('session')
    if (sessionId && token) {
      loadSession(sessionId)
    }
  }, [searchParams, token])

  const loadSessions = async () => {
    if (!token) return
    try {
      const data = await api.chat.getSessions(token)
      setSessions(data)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  const loadSession = async (sessionId: string) => {
    if (!token) return
    try {
      const data = await api.chat.getSession(token, sessionId)
      setCurrentSession(data)
      setMessages(
        data.messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at),
        }))
      )
    } catch (error) {
      console.error('Failed to load session:', error)
    }
  }

  const handleNewChat = () => {
    setCurrentSession({ id: 'new', title: 'New Chat' })
    setMessages([])
    setShowSessions(false)
    router.push('/chat')
  }

  const handleSendMessage = async (value: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: value,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    if (token) {
      try {
        const result = await api.chat.chat(token, {
          message: value,
          sessionId: currentSession?.id !== 'new' ? currentSession?.id : undefined,
        })

        if (result.sessionId !== currentSession?.id) {
          setCurrentSession({ id: result.sessionId, title: value.slice(0, 50) })
          router.push(`/chat?session=${result.sessionId}`)
        }

        const assistantMessage: ChatMessage = {
          id: result.messageId,
          role: 'assistant',
          content: result.response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
        loadSessions()
      } catch (error) {
        console.error('Chat error:', error)
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I apologize, but I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } else {
      const responses = [
        'I understand you want to explore this topic. Let me help you with that.',
        'That\'s a great question! Let me provide some insights.',
        'Based on my analysis, here are the key points to consider...',
      ]
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }

    setIsLoading(false)
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!token) return
    try {
      await api.chat.deleteSession(token, sessionId)
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      if (currentSession?.id === sessionId) {
        setCurrentSession(null)
        setMessages([])
        router.push('/chat')
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  const handleToggleStar = async (session: any) => {
    if (!token) return
    try {
      await api.chat.updateSession(token, session.id, {
        starred: session.starred ? 0 : 1,
      })
      loadSessions()
    } catch (error) {
      console.error('Failed to toggle star:', error)
    }
  }

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <div className="flex h-screen">
          {/* Sessions Sidebar - Mobile Drawer */}
          <div
            className={cn(
              "fixed lg:relative z-50 h-full w-80 bg-ink-cream border-r border-ink-light/20 transition-transform duration-300 lg:translate-x-0",
              showSessions ? "translate-x-0" : "-translate-x-full lg:block"
            )}
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-ink-light/20 flex items-center justify-between">
                <h2 className="font-medium">Chat History</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowSessions(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-4 space-y-4 flex-1 overflow-y-auto">
                <Button variant="primary" className="w-full" onClick={handleNewChat}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-gray" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chats..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white/50 border border-ink-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
                  />
                </div>

                <div className="space-y-2">
                  {filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => {
                        setCurrentSession(session)
                        loadSession(session.id)
                        router.push(`/chat?session=${session.id}`)
                        setShowSessions(false)
                      }}
                      className="cursor-pointer group"
                    >
                      <Card variant="paper" padding="sm" hover>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm truncate">{session.title}</h4>
                              {session.starred ? (
                                <Star
                                  className="w-3 h-3 text-yellow-500 fill-yellow-500 flex-shrink-0 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleStar(session)
                                  }}
                                />
                              ) : (
                                <Star
                                  className="w-3 h-3 text-ink-gray flex-shrink-0 cursor-pointer opacity-0 group-hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleStar(session)
                                  }}
                                />
                              )}
                            </div>
                            <p className="text-xs text-ink-gray mt-1 truncate">
                              {session.message_count || 0} messages
                            </p>
                            <span className="text-xs text-ink-light mt-2 block">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {new Date(session.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-7 h-7 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteSession(session.id)
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Overlay for mobile */}
          {showSessions && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowSessions(false)}
            />
          )}

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center gap-3 p-4 border-b border-ink-light/20">
              <Button variant="ghost" size="sm" onClick={() => setShowSessions(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="font-medium flex-1">Chat</h1>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-ink-light/10 flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-ink-gray" />
                  </div>
                  <h2 className="text-xl lg:text-2xl font-serif font-bold mb-2">
                    Start a Conversation
                  </h2>
                  <p className="text-ink-gray max-w-md">
                    Ask questions, get help with code, analyze documents, brainstorm ideas, and more.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-w-3xl mx-auto">
                  {messages.map((message) => (
                    <ChatBubble key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <ChatBubble
                      message={{
                        id: 'loading',
                        role: 'assistant',
                        content: 'Thinking...',
                        isLoading: true,
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 lg:p-6 border-t border-ink-light/20 bg-ink-cream/50">
              <div className="max-w-3xl mx-auto">
                <PromptInput onSubmit={handleSendMessage} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </Page>
    </div>
  )
}

function ChatLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-paper">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-ink-black border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-ink-gray">Loading...</p>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatContent />
    </Suspense>
  )
}
