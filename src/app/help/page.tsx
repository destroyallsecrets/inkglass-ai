'use client'

import React from 'react'
import { Sidebar } from '@/components/layout'
import { Container } from '@/components/layout'
import { Header, Page, Section } from '@/components/layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@/components/ui'
import {
  HelpCircle,
  Search,
  MessageSquare,
  Mail,
  ExternalLink,
  ChevronRight,
  Book,
  Video,
  MessageCircle,
  Code,
  Globe,
  Link2,
} from 'lucide-react'

const faqs = [
  {
    question: 'How do I start a new conversation?',
    answer: 'Click the "New Chat" button in the sidebar or on the home page. You can then type your message in the input field and press Enter or click the send button.',
  },
  {
    question: 'What AI models are available?',
    answer: 'You can choose from GPT-4 Turbo, GPT-3.5 Turbo, and Claude 3. The default model is GPT-4 Turbo for best results.',
  },
  {
    question: 'How do I save my conversations?',
    answer: 'All conversations are automatically saved to your account. You can access them from the sidebar under "Recent Chats".',
  },
  {
    question: 'Can I upload documents?',
    answer: 'Yes! Go to the Documents page and click "Upload" to add files. Supported formats include PDF, DOCX, TXT, and MD.',
  },
  {
    question: 'How do I change my settings?',
    answer: 'Navigate to Settings from the sidebar. Here you can customize theme, font size, and other preferences.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we use industry-standard encryption and your data is never shared with third parties.',
  },
]

const resources = [
  {
    icon: <Book className="w-6 h-6" />,
    title: 'Documentation',
    description: 'Comprehensive guides and API reference',
    badge: 'New',
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: 'Video Tutorials',
    description: 'Step-by-step video guides',
    badge: null,
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Community Forum',
    description: 'Connect with other users',
    badge: null,
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: 'API Documentation',
    description: 'Build with InkGlass API',
    badge: null,
  },
]

const contactOptions = [
  {
    icon: <Mail className="w-5 h-5" />,
    title: 'Email Support',
    description: 'support@inkglass.ai',
    action: 'Send Email',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Live Chat',
    description: 'Available 24/7',
    action: 'Start Chat',
  },
]

const projectLinks = [
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Live Demo',
    description: 'inkglass-ai.vercel.app',
    href: 'https://inkglass-ai.vercel.app',
  },
  {
    icon: <Link2 className="w-5 h-5" />,
    title: 'Source Code',
    description: 'github.com/destroyallsecrets/inkglass-ai',
    href: 'https://github.com/destroyallsecrets/inkglass-ai',
  },
]

export default function HelpPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container>
          <Header
            title="Help Center"
            subtitle="Find answers and get support"
          />

          <Section>
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-gray" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white/50 border border-ink-light/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-serif font-semibold mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <Card key={index} variant="paper" padding="md">
                        <button className="w-full text-left">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium">{faq.question}</h3>
                            <ChevronRight className="w-5 h-5 text-ink-gray flex-shrink-0" />
                          </div>
                          <p className="mt-3 text-ink-gray text-sm">{faq.answer}</p>
                        </button>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-serif font-semibold mb-4">Resources</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {resources.map((resource, index) => (
                      <Card key={index} variant="paper" padding="md" hover>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-ink-light/10 flex items-center justify-center text-ink-gray">
                            {resource.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{resource.title}</h4>
                              {resource.badge && (
                                <Badge size="sm">{resource.badge}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-ink-gray mt-1">
                              {resource.description}
                            </p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-ink-gray" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card variant="ink" padding="md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <HelpCircle className="w-5 h-5" />
                      Contact Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-ink-light text-sm mb-4">
                      Can&apos;t find what you&apos;re looking for? Our support team is here to help.
                    </p>
                    <div className="space-y-3">
                      {contactOptions.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-ink-medium/50"
                        >
                          <div className="text-ink-light">{option.icon}</div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-ink-paper">
                              {option.title}
                            </div>
                            <div className="text-xs text-ink-light">
                              {option.description}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-ink-paper hover:text-ink-black">
                            {option.action}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      Project Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projectLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 rounded-lg bg-ink-light/10 hover:bg-ink-light/20 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-xl bg-ink-black flex items-center justify-center text-ink-paper">
                            {link.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium">{link.title}</div>
                            <div className="text-sm text-ink-gray truncate">{link.description}</div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-ink-gray flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Use <strong>Ctrl + Enter</strong> to send messages quickly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Star important chats for quick access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Use the search bar to find past conversations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-ink-gray">•</span>
                        <span>Adjust temperature for more creative or precise responses</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="text-lg">Keyboard Shortcuts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-ink-gray">New chat</span>
                        <kbd className="px-2 py-1 bg-ink-light/10 rounded text-xs">Ctrl + N</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-gray">Search</span>
                        <kbd className="px-2 py-1 bg-ink-light/10 rounded text-xs">Ctrl + K</kbd>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ink-gray">Settings</span>
                        <kbd className="px-2 py-1 bg-ink-light/10 rounded text-xs">Ctrl + ,</kbd>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Section>
        </Container>
      </Page>
    </div>
  )
}
