'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout'
import { Container } from '@/components/layout'
import { Header, Page } from '@/components/layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Tabs,
  Alert,
} from '@/components/ui'
import {
  FileCode2,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Key,
  Terminal,
  Code,
  Shield,
  Zap,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const endpoints = [
  {
    method: 'POST',
    path: '/api/chat/chat',
    description: 'Send a message and get AI response',
    params: ['message (string)', 'sessionId (optional)'],
  },
  {
    method: 'GET',
    path: '/api/chat/sessions',
    description: 'List all chat sessions',
    params: [],
  },
  {
    method: 'POST',
    path: '/api/chat/sessions',
    description: 'Create a new chat session',
    params: ['title (string)'],
  },
  {
    method: 'GET',
    path: '/api/documents',
    description: 'List all documents',
    params: [],
  },
  {
    method: 'POST',
    path: '/api/documents',
    description: 'Upload a document',
    params: ['name (string)', 'type (string)', 'size (number)'],
  },
  {
    method: 'GET',
    path: '/api/settings/settings',
    description: 'Get user settings',
    params: [],
  },
  {
    method: 'PATCH',
    path: '/api/settings/settings',
    description: 'Update user settings',
    params: ['theme (string)', 'font_size (string)'],
  },
]

const codeExamples = {
  curl: `curl -X POST https://api.example.com/api/chat/chat \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "message": "Hello, how are you?"
  }'`,
  javascript: `const response = await fetch('/api/chat/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${apiKey}\`
  },
  body: JSON.stringify({
    message: 'Hello, how are you?'
  })
});

const data = await response.json();
console.log(data.response);`,
  python: `import requests

response = requests.post(
    'https://api.example.com/api/chat/chat',
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    },
    json={
        'message': 'Hello, how are you?'
    }
)

data = response.json()
print(data['response'])`,
  go: `package main

import (
    "bytes"
    "encoding/json"
    "net/http"
)

func chat(message string) {
    data := map[string]string{"message": message}
    payload, _ := json.Marshal(data)
    
    req, _ := http.NewRequest("POST", "/api/chat/chat", bytes.NewBuffer(payload))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer "+apiKey)
    
    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
}`,
}

const errorCodes = [
  { code: 400, message: 'Bad Request - Invalid parameters' },
  { code: 401, message: 'Unauthorized - Invalid or missing API key' },
  { code: 403, message: 'Forbidden - Insufficient permissions' },
  { code: 404, message: 'Not Found - Resource does not exist' },
  { code: 429, message: 'Too Many Requests - Rate limit exceeded' },
  { code: 500, message: 'Internal Server Error' },
]

export default function ApiDocsPage() {
  const [activeExample, setActiveExample] = useState<keyof typeof codeExamples>('javascript')
  const [copied, setCopied] = useState(false)
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeExamples[activeExample])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container className="max-w-5xl">
          <Header
            title="API Documentation"
            subtitle="Integrate InkGlass AI into your applications"
          />

          <div className="space-y-6">
            <Alert title="API Access" intent="info">
              <p className="text-sm mt-1">
                Generate an API key in your{' '}
                <a href="/settings" className="text-ink-black underline font-medium">
                  settings
                </a>{' '}
                to access the API. The API is currently in development mode.
              </p>
            </Alert>

            <Card variant="paper" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ink-gray mb-4">
                  All API requests require an API key in the Authorization header:
                </p>
                <div className="bg-ink-light/10 p-4 rounded-lg font-mono text-sm">
                  Authorization: Bearer YOUR_API_KEY
                </div>
              </CardContent>
            </Card>

            <Card variant="paper" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {endpoints.map((endpoint) => (
                    <div 
                      key={endpoint.path}
                      className={cn(
                        "border border-ink-light/20 rounded-lg overflow-hidden",
                        expandedEndpoint === endpoint.path && "ring-2 ring-ink-black"
                      )}
                    >
                      <button
                        onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.path ? null : endpoint.path)}
                        className="w-full flex items-center gap-3 p-4 text-left hover:bg-ink-light/5 transition-colors"
                      >
                        <span className={cn(
                          "px-2 py-1 text-xs font-bold rounded",
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                          endpoint.method === 'PATCH' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        )}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                        <span className="flex-1 text-sm text-ink-gray">{endpoint.description}</span>
                      </button>
                      {expandedEndpoint === endpoint.path && (
                        <div className="px-4 pb-4 border-t border-ink-light/20 pt-4">
                          {endpoint.params.length > 0 && (
                            <>
                              <h4 className="text-sm font-medium mb-2">Parameters:</h4>
                              <ul className="space-y-1 mb-4">
                                {endpoint.params.map((param) => (
                                  <li key={param} className="text-sm text-ink-gray">
                                    • <code className="font-mono">{param}</code>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                          <h4 className="text-sm font-medium mb-2">Example Request:</h4>
                          <div className="bg-ink-light/10 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                            {endpoint.method === 'GET' 
                              ? `curl -X GET https://api.example.com${endpoint.path} \\
  -H "Authorization: Bearer YOUR_API_KEY"`
                              : `curl -X ${endpoint.method} https://api.example.com${endpoint.path} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '${JSON.stringify(
                            Object.fromEntries(
                              endpoint.params.map(p => [p.split(' ')[0], p.split(' ')[0] === 'message' ? 'Hello' : 'value'])
                            )
                          )}'`
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="paper" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Code Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  {Object.keys(codeExamples).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveExample(lang as keyof typeof codeExamples)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-lg transition-colors capitalize",
                        activeExample === lang
                          ? "bg-ink-black text-ink-paper"
                          : "bg-ink-light/10 text-ink-gray hover:bg-ink-light/20"
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <pre className="bg-ink-light/10 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    {codeExamples[activeExample]}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="paper" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Error Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {errorCodes.map((error) => (
                    <div key={error.code} className="flex items-center gap-4 p-3 bg-ink-light/5 rounded-lg">
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded">
                        {error.code}
                      </span>
                      <span className="text-sm text-ink-gray">{error.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card variant="ink" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Rate Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <p className="text-2xl font-serif font-bold">100</p>
                    <p className="text-sm text-ink-light">Requests/minute</p>
                  </div>
                  <div className="text-center p-4">
                    <p className="text-2xl font-serif font-bold">10,000</p>
                    <p className="text-sm text-ink-light">Tokens/request</p>
                  </div>
                  <div className="text-center p-4">
                    <p className="text-2xl font-serif font-bold">1,000</p>
                    <p className="text-sm text-ink-light">Requests/day</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="paper" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-ink-light/10 flex items-center justify-center text-xs font-bold">1</span>
                    <div>
                      <p className="font-medium">Never expose API keys client-side</p>
                      <p className="text-sm text-ink-gray">Always make API calls from your backend server</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-ink-light/10 flex items-center justify-center text-xs font-bold">2</span>
                    <div>
                      <p className="font-medium">Store keys securely</p>
                      <p className="text-sm text-ink-gray">Use environment variables or secret management services</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-ink-light/10 flex items-center justify-center text-xs font-bold">3</span>
                    <div>
                      <p className="font-medium">Rotate keys regularly</p>
                      <p className="text-sm text-ink-gray">Generate new keys periodically and revoke old ones</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-ink-light/10 flex items-center justify-center text-xs font-bold">4</span>
                    <div>
                      <p className="font-medium">Monitor usage</p>
                      <p className="text-sm text-ink-gray">Track API usage for anomalies</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Page>
    </div>
  )
}
