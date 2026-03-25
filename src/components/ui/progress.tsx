'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { ProgressProps, Size } from '@/types'

const sizeStyles: Record<Size, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
  xl: 'h-4',
  icon: 'h-0.5',
}

const colorStyles = {
  default: 'bg-ink-black',
  success: 'bg-green-600',
  warning: 'bg-yellow-500',
  error: 'bg-red-600',
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  color = 'default',
  showLabel = false,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className="w-full">
      <div
        className={cn(
          'w-full bg-ink-light/20 rounded-full overflow-hidden',
          sizeStyles[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            colorStyles[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-ink-gray text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}
