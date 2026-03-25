'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { TextareaProps } from '@/types'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-ink-black mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg',
            'text-ink-black placeholder:text-ink-gray',
            'transition-all duration-200 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-ink-light/10',
            error && 'border-red-500 focus:ring-red-500/30 focus:border-red-500',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn('mt-1.5 text-sm', error ? 'text-red-500' : 'text-ink-gray')}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
