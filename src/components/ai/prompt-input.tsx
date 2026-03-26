'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Send, Sparkles, Mic, Image, Paperclip } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconButton } from '@/components/ui/button'

interface PromptInputProps {
  onSubmit: (value: string) => void
  isLoading?: boolean
  placeholder?: string
  className?: string
}

export function PromptInput({
  onSubmit,
  isLoading = false,
  placeholder = 'Ask anything...',
  className,
}: PromptInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [value])

  const handleSubmit = () => {
    if (value.trim() && !isLoading) {
      onSubmit(value.trim())
      setValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const quickPrompts = [
    { label: 'Explain this code', icon: '📝', ariaLabel: 'Explain this code prompt' },
    { label: 'Write a function', icon: '⚡', ariaLabel: 'Write a function prompt' },
    { label: 'Debug help', icon: '🔧', ariaLabel: 'Debug help prompt' },
    { label: 'Best practices', icon: '✨', ariaLabel: 'Best practices prompt' },
  ]

  return (
    <div className={cn('w-full', className)} role="form" aria-label="Message input">
      <div className="glass-card p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              rows={1}
              aria-label="Message text"
              aria-describedby={isLoading ? 'input-loading' : undefined}
              className={cn(
                'w-full px-4 py-3 bg-transparent border-none resize-none',
                'text-ink-black placeholder:text-ink-gray',
                'focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:ring-inset',
                'max-h-[200px]',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            />
            {isLoading && (
              <span id="input-loading" className="sr-only" role="status" aria-live="polite">
                Loading, please wait...
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <IconButton
              variant="ghost"
              size="sm"
              className="text-ink-gray hover:text-ink-black"
              aria-label="Attach file"
              disabled={isLoading}
            >
              <Paperclip className="w-4 h-4" />
            </IconButton>
            <IconButton
              variant="ghost"
              size="sm"
              className="text-ink-gray hover:text-ink-black"
              aria-label="Add image"
              disabled={isLoading}
            >
              <Image className="w-4 h-4" />
            </IconButton>
            <IconButton
              variant="ghost"
              size="sm"
              className="text-ink-gray hover:text-ink-black"
              aria-label="Use voice input"
              disabled={isLoading}
            >
              <Mic className="w-4 h-4" />
            </IconButton>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!value.trim() || isLoading}
              aria-label="Send message"
              aria-disabled={!value.trim() || isLoading}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:ring-offset-2',
                value.trim() && !isLoading
                  ? 'bg-ink-black text-ink-paper'
                  : 'bg-ink-light/20 text-ink-gray cursor-not-allowed'
              )}
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {!value && !isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-ink-light/20"
              aria-label="Quick prompt suggestions"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-ink-gray" />
                <span className="text-xs text-ink-gray font-medium">Quick prompts</span>
              </div>
              <div className="flex flex-wrap gap-2" role="list">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setValue(prompt.label)}
                    aria-label={prompt.ariaLabel}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-full',
                      'bg-ink-light/10 text-ink-gray',
                      'hover:bg-ink-light/20 hover:text-ink-black',
                      'transition-colors duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-ink-medium/30'
                    )}
                  >
                    {prompt.icon} {prompt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
