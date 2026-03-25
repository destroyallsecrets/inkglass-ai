'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout'
import { Container } from '@/components/layout'
import { Header, Page, Section } from '@/components/layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Alert,
  Tabs,
} from '@/components/ui'
import { Select } from '@/components/forms'
import {
  Code,
  Play,
  Copy,
  Check,
  RefreshCw,
  Save,
  ChevronDown,
  HelpCircle,
  Lightbulb,
  Keyboard,
  BookOpen,
  Sparkles,
  FileCode,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
]

const actions = [
  { value: 'write', label: 'Write Code' },
  { value: 'debug', label: 'Debug' },
  { value: 'explain', label: 'Explain' },
  { value: 'optimize', label: 'Optimize' },
  { value: 'review', label: 'Review' },
  { value: 'convert', label: 'Convert' },
]

const frameworks = [
  { value: 'none', label: 'None' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'express', label: 'Express' },
  { value: 'django', label: 'Django' },
  { value: 'flask', label: 'Flask' },
  { value: 'fastapi', label: 'FastAPI' },
  { value: 'laravel', label: 'Laravel' },
]

export default function CodePage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [action, setAction] = useState('write')
  const [framework, setFramework] = useState('none')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showDocs, setShowDocs] = useState(true)

  const handleProcess = async () => {
    if (!input.trim()) return
    setIsProcessing(true)
    
    setTimeout(() => {
      const response = `// ${action === 'write' ? 'Generated Code' : action === 'debug' ? 'Debug Analysis' : action === 'explain' ? 'Code Explanation' : action === 'optimize' ? 'Optimized Code' : 'Code Review'}

${getSimulatedCode(language, action, framework, input)}`
      setOutput(response)
      setIsProcessing(false)
    }, 1500)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setInput('')
    setOutput('')
  }

  const keyboardShortcuts = [
    { keys: ['Ctrl', 'Enter'], action: 'Submit code' },
    { keys: ['Ctrl', 'Shift', 'C'], action: 'Copy output' },
    { keys: ['Ctrl', 'N'], action: 'New session' },
    { keys: ['Ctrl', '/'], action: 'Toggle docs' },
  ]

  const tips = [
    'Be specific about what you want the code to do',
    'Include the framework name for better results',
    'Mention any specific requirements or constraints',
    'For debugging, paste the error message',
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container>
          <Header
            title="Code Generation"
            subtitle="Write, debug, and explain code with AI"
            actions={
              <Button variant="secondary" onClick={() => setShowDocs(!showDocs)}>
                <HelpCircle className="w-4 h-4 mr-2" />
                {showDocs ? 'Hide Docs' : 'Show Docs'}
              </Button>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={cn("space-y-6", showDocs ? "lg:col-span-2" : "lg:col-span-3")}>
              <Card variant="paper" padding="lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="w-5 h-5" />
                    Code Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Select
                      label="Language"
                      options={languages}
                      value={language}
                      onChange={(v) => setLanguage(v)}
                    />
                    <Select
                      label="Action"
                      options={actions}
                      value={action}
                      onChange={(v) => setAction(v)}
                    />
                    <Select
                      label="Framework"
                      options={frameworks}
                      value={framework}
                      onChange={(v) => setFramework(v)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-ink-black mb-2">
                        {action === 'write' ? 'Describe what you want to build' : 
                         action === 'debug' ? 'Paste your code with errors' :
                         action === 'explain' ? 'Paste code to explain' :
                         action === 'optimize' ? 'Paste code to optimize' :
                         action === 'review' ? 'Paste code to review' : 'Code'}
                      </label>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={getPlaceholder(action)}
                        className="w-full h-48 px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <Button onClick={handleProcess} isLoading={isProcessing} disabled={!input.trim()}>
                      <Play className="w-4 h-4 mr-2" />
                      {action === 'write' ? 'Generate' : 
                       action === 'debug' ? 'Debug' :
                       action === 'explain' ? 'Explain' :
                       action === 'optimize' ? 'Optimize' : 'Review'}
                    </Button>
                    <Button variant="ghost" onClick={handleReset}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {output && (
                <Card variant="glass" padding="lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        Output
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCopy}>
                          {copied ? <Check className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-ink-light/10 p-4 rounded-lg overflow-x-auto font-mono text-sm whitespace-pre-wrap">
                      {output}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>

            {showDocs && (
              <div className="space-y-6">
                <Card variant="ink" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Lightbulb className="w-5 h-5" />
                      Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-ink-light">
                          <span className="text-ink-gray">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Keyboard className="w-5 h-5" />
                      Shortcuts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {keyboardShortcuts.map((shortcut, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-ink-gray">{shortcut.action}</span>
                          <div className="flex gap-1">
                            {shortcut.keys.map((key, j) => (
                              <kbd key={j} className="px-2 py-1 bg-ink-light/10 rounded text-xs font-mono">
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card variant="paper" padding="md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="w-5 h-5" />
                      Supported Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang) => (
                        <span 
                          key={lang.value}
                          className={cn(
                            "px-2 py-1 text-xs rounded-full",
                            language === lang.value 
                              ? "bg-ink-black text-ink-paper" 
                              : "bg-ink-light/10 text-ink-gray"
                          )}
                        >
                          {lang.label}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Alert title="About Code Generation" intent="info">
                  <p className="text-sm text-ink-light mt-1">
                    The AI can help you write new code, debug existing code, 
                    explain how code works, optimize performance, or review 
                    code quality.
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

function getPlaceholder(action: string): string {
  switch (action) {
    case 'write':
      return `Describe what you want to build...

Example:
Create a React hook that fetches data from an API with loading and error states`
    case 'debug':
      return `Paste your code with the error...

Example:
function getUser() {
  return fetch('/api/user')
  // Error: Cannot read property 'name' of undefined
}`
    case 'explain':
      return `Paste code to explain...

Example:
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};`
    case 'optimize':
      return `Paste code to optimize...

Example:
for (let i = 0; i < 1000000; i++) {
  console.log(i);
}`
    default:
      return 'Enter your code here...'
  }
}

function getSimulatedCode(language: string, action: string, framework: string, input: string): string {
  if (action === 'write') {
    return `// Generated ${language} code${framework !== 'none' ? ` using ${framework}` : ''}

${getCodeTemplate(language, framework)}`
  } else if (action === 'debug') {
    return `// Debug Analysis

**Issues Found:**
1. Missing error handling for API response
2. No loading state management
3. Undefined check needed before accessing properties

**Suggested Fix:**
\`\`\`${language}
// Add error handling
try {
  const response = await fetch('/api/user');
  if (!response.ok) throw new Error('Failed to fetch');
  const data = await response.json();
  // Now safe to access data properties
} catch (error) {
  console.error('Error:', error);
}
\`\`\``
  } else if (action === 'explain') {
    return `// Code Explanation

This code implements a **debounce pattern** commonly used for:

1. **Delay execution** - Waits until the user stops calling the function
2. **Clear previous timer** - Cancels any pending execution
3. **Single execution** - Only runs once after the delay

**How it works:**
- When called, it clears any existing timeout
- Sets a new timeout for the specified delay
- Only executes if no new calls are made within that delay
- Useful for search inputs, resize handlers, etc.
`
  } else if (action === 'optimize') {
    return `// Optimized Code

**Performance Improvements:**
1. Reduced loop iterations
2. Added early termination
3. Used more efficient algorithm

\`\`\`${language}
// Before: O(n²) complexity
// After: O(n) complexity

const result = data
  .filter(item => item.active)
  .map(item => item.value)
  .slice(0, 10);
\`\`\`

**Estimated improvement:** 60-80% faster execution
`
  } else {
    return `// Code Review

**Summary:** The code is functional but has room for improvement.

**Strengths:**
✓ Clean naming conventions
✓ Good use of modern syntax
✓ Reasonable structure

**Suggestions:**
1. Add JSDoc comments for functions
2. Consider extracting magic numbers to constants
3. Add unit tests for edge cases
4. Use TypeScript for better type safety
`
  }
}

function getCodeTemplate(language: string, framework: string): string {
  const templates: Record<string, Record<string, string>> = {
    javascript: {
      none: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}`,
      react: `import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}`,
      express: `const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromDatabase(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;`,
    },
    typescript: {
      none: `interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
}`,
      nextjs: `import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const data = await fetchData(id);
  return NextResponse.json(data);
}`,
    },
    python: {
      none: `import asyncio
from typing import Optional

async def fetch_data(url: str) -> Optional[dict]:
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url) as response:
                return await response.json()
        except aiohttp.ClientError as e:
            print(f"Error: {e}")
            return None`,
      django: `from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def get_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        return JsonResponse({
            'id': user.id,
            'name': user.name,
            'email': user.email
        })
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)`,
      flask: `from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/users/<int:user_id>')
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email
    })`,
    },
    go: {
      none: `package main

import (
    "encoding/json"
    "net/http"
)

type User struct {
    ID    string \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

func fetchUser(id string) (*User, error) {
    resp, err := http.Get("/api/users/" + id)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var user User
    if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
        return nil, err
    }
    return &user, nil
}`,
    },
    rust: {
      none: `use serde::{Deserialize, Serialize};
use reqwest::Client;
use tokio;

#[derive(Serialize, Deserialize)]
struct User {
    id: String,
    name: String,
    email: String,
}

async fn fetch_user(id: &str) -> Result<User, reqwest::Error> {
    let client = Client::new();
    let response = client
        .get(&format!("https://api.example.com/users/{}", id))
        .send()
        .await?;
    
    response.json::<User>().await
}`,
    },
  }

  const langTemplates = templates[language] || templates.javascript
  return langTemplates[framework] || langTemplates.none || '// Code not available for this combination'
}
