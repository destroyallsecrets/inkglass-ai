'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, ThumbsUp, ThumbsDown, Share2, Bookmark } from 'lucide-react'
import { IconButton } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { Intent } from '@/types'

interface ResponseCardProps {
  title?: string
  content: string
  type?: 'code' | 'text' | 'analysis'
  confidence?: number
  category?: string
  onCopy?: () => void
  onBookmark?: () => void
  className?: string
}

export function ResponseCard({
  title,
  content,
  type = 'text',
  confidence,
  category,
  onCopy,
  onBookmark,
  className,
}: ResponseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card variant="paper" className={cn('overflow-hidden', className)}>
        {(title || category || confidence) && (
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {title && <CardTitle className="text-lg">{title}</CardTitle>}
                {category && <Badge size="sm">{category}</Badge>}
              </div>
              {confidence !== undefined && (
                <Badge
                  color={
                    confidence > 80
                      ? 'success'
                      : confidence > 50
                      ? 'warning'
                      : 'error'
                  }
                  size="sm"
                >
                  {confidence}% confidence
                </Badge>
              )}
            </div>
          </CardHeader>
        )}
        <CardContent>
          <pre
            className={cn(
              'whitespace-pre-wrap font-mono text-sm',
              type === 'code' && 'bg-ink-light/10 p-4 rounded-lg overflow-x-auto',
              type === 'text' && 'prose prose-sm',
              type === 'analysis' && 'prose prose-sm'
            )}
          >
            {content}
          </pre>

          <div className="mt-4 pt-4 border-t border-ink-light/20 flex items-center gap-2">
            <IconButton
              variant="ghost"
              size="sm"
              onClick={onCopy}
              className="text-ink-gray hover:text-ink-black"
            >
              <Copy className="w-4 h-4" />
            </IconButton>
            <IconButton
              variant="ghost"
              size="sm"
              className="text-ink-gray hover:text-ink-black"
            >
              <ThumbsUp className="w-4 h-4" />
            </IconButton>
            <IconButton
              variant="ghost"
              size="sm"
              className="text-ink-gray hover:text-ink-black"
            >
              <ThumbsDown className="w-4 h-4" />
            </IconButton>
            <IconButton
              variant="ghost"
              size="sm"
              className="text-ink-gray hover:text-ink-black"
            >
              <Share2 className="w-4 h-4" />
            </IconButton>
            <IconButton
              variant="ghost"
              size="sm"
              onClick={onBookmark}
              className="text-ink-gray hover:text-ink-black"
            >
              <Bookmark className="w-4 h-4" />
            </IconButton>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
