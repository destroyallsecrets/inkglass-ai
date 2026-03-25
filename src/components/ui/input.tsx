'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { InputProps } from '@/types'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-ink-black mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-gray">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg',
              'text-ink-black placeholder:text-ink-gray',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-ink-light/10',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:ring-red-500/30 focus:border-red-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-gray">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn('mt-1.5 text-sm', error ? 'text-red-500' : 'text-ink-gray')}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
