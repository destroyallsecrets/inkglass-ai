'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, Button } from '@/components/ui'
import { WifiOff, RefreshCw, Home } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-ink-cream flex items-center justify-center p-4">
      <Card variant="paper" padding="lg" className="max-w-md w-full text-center">
        <CardContent className="space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-ink-light/20 flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-ink-gray" />
          </div>
          
          <div>
            <h1 className="text-2xl font-serif font-semibold text-ink-black mb-2">
              You&apos;re Offline
            </h1>
            <p className="text-ink-light">
              Don&apos;t worry - InkGlass has cached your recent pages. 
              Some features may be limited until you reconnect.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={() => window.location.reload()} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
