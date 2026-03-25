'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { BadgeProps } from '@/types'

const colorStyles = {
  default: 'bg-ink-light/20 text-ink-black border-ink-light/30',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
}

const solidColorStyles = {
  default: 'bg-ink-black text-ink-paper',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-black',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
}

export function Badge({
  children,
  variant = 'default',
  color = 'default',
  size = 'md',
}: BadgeProps) {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variant === 'solid' ? solidColorStyles[color] : colorStyles[color],
        sizeStyles
      )}
    >
      {children}
    </span>
  )
}
