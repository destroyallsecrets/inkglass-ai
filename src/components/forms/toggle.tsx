'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ToggleProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3',
    translate: 16,
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5',
    translate: 20,
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6',
    translate: 28,
  },
}

export function Toggle({
  checked = false,
  onChange,
  label,
  disabled,
  size = 'md',
  className,
}: ToggleProps) {
  const styles = sizeStyles[size]

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange?.(!checked)}
        disabled={disabled}
        className={cn(
          'relative inline-flex items-center rounded-full transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-ink-medium/30',
          checked ? 'bg-ink-black' : 'bg-ink-light/40',
          styles.track
        )}
      >
        <motion.span
          initial={false}
          animate={{ x: checked ? styles.translate : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'rounded-full bg-ink-paper shadow-sm',
            styles.thumb
          )}
        />
      </button>
      {label && (
        <span className="text-sm text-ink-black select-none">{label}</span>
      )}
    </label>
  )
}
