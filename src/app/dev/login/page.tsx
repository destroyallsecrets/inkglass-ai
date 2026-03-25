'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, Alert } from '@/components/ui'
import { Button } from '@/components/ui'
import { useAuth } from '@/lib/auth'
import { ArrowRight, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react'

export default function DevLoginPage() {
  const router = useRouter()
  const { loginDemo } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await loginDemo(email)
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-paper paper-texture flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-ink-black flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-ink-paper" />
            </div>
            <span className="font-serif font-semibold text-2xl text-ink-black">InkGlass</span>
          </Link>
        </div>

        <Alert 
          title="Development Mode" 
          intent="warning"
          className="mb-6"
        >
          <p className="text-sm mt-1">
            <strong>Demo Login:</strong> This is a demonstration authentication page. 
            Any email/password combination will work. User data is stored locally in your 
            browser and will be cleared when you clear site data. Do not use real passwords.
          </p>
        </Alert>

        <Card variant="glass" padding="lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Demo Login</CardTitle>
            <p className="text-center text-ink-gray mt-2">
              Enter any email and password to continue
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-black mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-gray" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="demo@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-black mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-gray" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Any password"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium transition-colors"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Demo Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-center text-sm text-ink-gray">
                <Link href="/dev/register" className="text-ink-black font-medium underline underline-offset-4">
                  Create Demo Account
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-ink-light mt-6">
          Development tools | InkGlass AI Template
        </p>
      </div>
    </div>
  )
}
