'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types'
import { Bot, User, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatTime } from '@/lib/utils'

interface ChatBubbleProps {
  message: ChatMessage
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex gap-3', isUser && 'flex-row-reverse')}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-ink-black' : 'bg-ink-light/20 border border-ink-light/30'
        )}
      >
        {message.isLoading ? (
          <Loader2 className="w-4 h-4 text-ink-gray animate-spin" />
        ) : isUser ? (
          <User className="w-4 h-4 text-ink-paper" />
        ) : (
          <Bot className="w-4 h-4 text-ink-black" />
        )}
      </div>

      <div
        className={cn(
          'max-w-[80%] px-4 py-3 rounded-2xl',
          isUser
            ? 'bg-ink-black text-ink-paper rounded-tr-md'
            : 'bg-ink-cream/80 border border-ink-light/20 text-ink-black rounded-tl-md',
          message.isLoading && 'animate-pulse'
        )}
      >
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {message.timestamp && (
          <div
            className={cn(
              'text-xs mt-2',
              isUser ? 'text-ink-light' : 'text-ink-gray'
            )}
          >
            {formatTime(message.timestamp)}
          </div>
        )}
      </div>
    </motion.div>
  )
}
