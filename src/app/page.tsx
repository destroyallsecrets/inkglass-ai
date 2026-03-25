'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sidebar } from '@/components/layout'
import { Container, Stack } from '@/components/layout'
import { Header, Page, Section } from '@/components/layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Progress,
  Tabs,
  Alert,
} from '@/components/ui'
import { Select, Toggle } from '@/components/forms'
import { ChatBubble, PromptInput } from '@/components/ai'
import { useAuth } from '@/lib/auth'
import api from '@/lib/api'
import {
  Sparkles,
  Code,
  FileText,
  Image,
  Lightbulb,
  TrendingUp,
  Clock,
  ArrowRight,
  Cpu,
  Layers,
  MessageSquare,
  Languages,
  PenTool,
  BarChart3,
  User,
} from 'lucide-react'
import type { ChatMessage } from '@/types'

const features = [
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Conversational AI',
    description: 'Natural language conversations with context awareness',
    href: '/chat',
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Code Generation',
    description: 'Write, debug, and explain code in multiple languages',
    href: '/code',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Document Analysis',
    description: 'Summarize and extract insights from documents',
    href: '/documents',
  },
  {
    icon: <Image className="w-6 h-6" />,
    title: 'Image Analysis',
    description: 'Analyze and describe images with precision',
    href: '/images',
  },
  {
    icon: <Languages className="w-6 h-6" />,
    title: 'Translation',
    description: 'Translate text between 50+ languages',
    href: '/translate',
  },
  {
    icon: <PenTool className="w-6 h-6" />,
    title: 'Writing Assistant',
    description: 'Generate and edit content with AI',
    href: '/write',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Data Analysis',
    description: 'Analyze data and generate insights',
    href: '/analyze',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI Tools',
    description: 'Powerful AI tools for various tasks',
    href: '/tools',
  },
]

export default function HomePage() {
  const { user, token, isDemoMode, logout } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today? I can help with code, documents, analysis, and much more.',
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [statsData, setStatsData] = useState<any>(null)
  const [recentChats, setRecentChats] = useState<any[]>([])

  useEffect(() => {
    if (token) {
      api.analytics.getStats(token).then(setStatsData).catch(console.error)
      api.chat.getSessions(token).then((sessions) => {
        setRecentChats(sessions.slice(0, 3))
      }).catch(console.error)
    }
  }, [token])

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
        const result = await api.chat.chat(token, { message: value })
        const assistantMessage: ChatMessage = {
          id: result.messageId,
          role: 'assistant',
          content: result.response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } catch (error) {
        console.error('Chat error:', error)
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I apologize, but I encountered an error. Please try again.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } else {
      const responses = [
        'I understand you want to explore this topic. Let me help you with that.',
        'That\'s a great question! Let me provide some insights.',
        'Based on my analysis, here are the key points...',
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

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container>
          <Header
            title={`Welcome${user?.name ? `, ${user.name}` : ''}`}
            subtitle="Your intelligent companion for coding, writing, and analysis"
          />

          {isDemoMode && (
            <div className="mb-6">
              <Alert 
                title="Demo Mode Active" 
                intent="warning"
                className="flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm">
                    You&apos;re using the app in demo mode. Data is stored locally in your browser.
                    <Link href="/dev/login" className="ml-2 text-ink-black underline font-medium">
                      Sign in
                    </Link>
                    {' '}for full access.
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="ml-4">
                  Clear Demo
                </Button>
              </Alert>
            </div>
          )}

          {!user && (
            <div className="mb-6">
              <Alert 
                title="Get Started" 
                intent="info"
                className="flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm">
                    Explore all features with full access.
                    <Link href="/dev/login" className="ml-2 text-ink-black underline font-medium">
                      Demo Login
                    </Link>
                  </p>
                </div>
              </Alert>
            </div>
          )}

          <Section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card variant="glass" padding="lg" hover>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Chat with AI
                      </CardTitle>
                      <Badge>Pro</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
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
                    <PromptInput onSubmit={handleSendMessage} isLoading={isLoading} />
                  </CardContent>
                </Card>

                <Tabs
                  tabs={[
                    {
                      id: 'features',
                      label: 'Features',
                      icon: <Sparkles className="w-4 h-4" />,
                      content: (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {features.map((feature, index) => (
                            <Link key={index} href={feature.href}>
                              <Card variant="paper" padding="md" hover>
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 rounded-lg bg-ink-light/10 flex items-center justify-center">
                                    {feature.icon}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{feature.title}</h4>
                                    <p className="text-sm text-ink-gray mt-1">
                                      {feature.description}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      ),
                    },
                    {
                      id: 'stats',
                      label: 'Statistics',
                      icon: <TrendingUp className="w-4 h-4" />,
                      content: (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <Card variant="paper" padding="md">
                            <div className="text-center">
                              <div className="w-10 h-10 rounded-full bg-ink-light/10 flex items-center justify-center mx-auto mb-3">
                                <MessageSquare className="w-4 h-4" />
                              </div>
                              <div className="text-2xl font-serif font-bold">
                                {statsData?.conversations || '0'}
                              </div>
                              <div className="text-sm text-ink-gray">Conversations</div>
                            </div>
                          </Card>
                          <Card variant="paper" padding="md">
                            <div className="text-center">
                              <div className="w-10 h-10 rounded-full bg-ink-light/10 flex items-center justify-center mx-auto mb-3">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div className="text-2xl font-serif font-bold">
                                {statsData?.tokensUsed?.toLocaleString() || '0'}
                              </div>
                              <div className="text-sm text-ink-gray">Tokens Used</div>
                            </div>
                          </Card>
                          <Card variant="paper" padding="md">
                            <div className="text-center">
                              <div className="w-10 h-10 rounded-full bg-ink-light/10 flex items-center justify-center mx-auto mb-3">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="text-2xl font-serif font-bold">
                                {statsData?.documents || '0'}
                              </div>
                              <div className="text-sm text-ink-gray">Documents</div>
                            </div>
                          </Card>
                          <Card variant="paper" padding="md">
                            <div className="text-center">
                              <div className="w-10 h-10 rounded-full bg-ink-light/10 flex items-center justify-center mx-auto mb-3">
                                <TrendingUp className="w-4 h-4" />
                              </div>
                              <div className="text-2xl font-serif font-bold">
                                {statsData?.accuracy || '97.8'}%
                              </div>
                              <div className="text-sm text-ink-gray">Accuracy</div>
                            </div>
                          </Card>
                        </div>
                      ),
                    },
                    {
                      id: 'recent',
                      label: 'Recent',
                      icon: <Clock className="w-4 h-4" />,
                      content: (
                        <div className="space-y-4">
                          {recentChats.length > 0 ? recentChats.map((chat) => (
                            <Link key={chat.id} href={`/chat?session=${chat.id}`}>
                              <Card variant="paper" padding="md" hover>
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium">{chat.title}</h4>
                                    <p className="text-sm text-ink-gray mt-1">
                                      {chat.message_count || 0} messages
                                    </p>
                                    <span className="text-xs text-ink-light mt-2 block">
                                      {new Date(chat.updated_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <ArrowRight className="w-4 h-4" />
                                  </Button>
                                </div>
                              </Card>
                            </Link>
                          )) : (
                            <Card variant="paper" padding="md">
                              <div className="text-center py-8">
                                <MessageSquare className="w-12 h-12 text-ink-gray mx-auto mb-4" />
                                <p className="text-ink-gray">No recent conversations</p>
                                <Link href="/chat">
                                  <Button variant="secondary" className="mt-4">
                                    Start a new chat
                                  </Button>
                                </Link>
                              </div>
                            </Card>
                          )}
                        </div>
                      ),
                    },
                  ]}
                />
              </div>

              <div className="space-y-6">
                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack gap="sm">
                      <Link href="/chat">
                        <Button variant="secondary" className="w-full justify-start">
                          <Code className="w-4 h-4 mr-2" />
                          Write Code
                        </Button>
                      </Link>
                      <Link href="/documents">
                        <Button variant="secondary" className="w-full justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          Analyze Document
                        </Button>
                      </Link>
                      <Link href="/tools">
                        <Button variant="secondary" className="w-full justify-start">
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Brainstorm Ideas
                        </Button>
                      </Link>
                      <Link href="/tools">
                        <Button variant="secondary" className="w-full justify-start">
                          <Image className="w-4 h-4 mr-2" />
                          Analyze Image
                        </Button>
                      </Link>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="ink" padding="md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Cpu className="w-5 h-5" />
                      Model Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack gap="md">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-ink-light">GPU Memory</span>
                          <span className="text-ink-paper">{statsData?.gpuUsage || '0'}%</span>
                        </div>
                        <Progress value={statsData?.gpuUsage || 0} size="sm" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-ink-light">CPU Usage</span>
                          <span className="text-ink-paper">{statsData?.cpuUsage || '0'}%</span>
                        </div>
                        <Progress value={statsData?.cpuUsage || 0} size="sm" />
                      </div>
                      <Alert title="All systems operational" intent="success">
                        Models are running at optimal performance
                      </Alert>
                    </Stack>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="text-lg">Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack gap="md">
                      <Select
                        label="Model"
                        options={[
                          { value: 'gpt-4', label: 'GPT-4 Turbo' },
                          { value: 'gpt-3.5', label: 'GPT-3.5 Turbo' },
                          { value: 'claude', label: 'Claude 3' },
                        ]}
                        value="gpt-4"
                        onChange={() => {}}
                      />
                      <Select
                        label="Temperature"
                        options={[
                          { value: '0.2', label: 'Precise (0.2)' },
                          { value: '0.7', label: 'Balanced (0.7)' },
                          { value: '1.0', label: 'Creative (1.0)' },
                        ]}
                        value="0.7"
                        onChange={() => {}}
                      />
                      <Toggle label="Stream responses" checked />
                      <Toggle label="Save conversation" checked />
                    </Stack>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Section>

          <Section>
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-light/10 text-sm text-ink-gray mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Powered by cutting-edge AI technology</span>
              </div>
              <h2 className="text-2xl font-serif font-bold mb-2">
                Ready to get started?
              </h2>
              <p className="text-ink-gray mb-6 max-w-md mx-auto">
                Explore the capabilities of our AI platform and discover how it can transform your workflow.
              </p>
              <Link href="/chat">
                <Button size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Exploring
                </Button>
              </Link>
            </div>
          </Section>
        </Container>
      </Page>
    </div>
  )
}
