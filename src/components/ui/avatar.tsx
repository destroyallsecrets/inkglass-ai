'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { AvatarProps, Size } from '@/types'

const sizeStyles: Record<Size, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

export function Avatar({ src, alt, fallback, size = 'md' }: AvatarProps) {
  const initials = fallback
    ? fallback
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-ink-light/20 flex items-center justify-center',
        'font-medium text-ink-gray border border-ink-light/30',
        sizeStyles[size]
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
