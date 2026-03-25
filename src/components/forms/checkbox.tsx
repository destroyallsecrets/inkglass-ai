'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export function Checkbox({
  checked = false,
  onChange,
  label,
  disabled,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-ink-medium/30',
          checked
            ? 'bg-ink-black border-ink-black'
            : 'bg-transparent border-ink-light/50 hover:border-ink-medium'
        )}
      >
        <motion.div
          initial={false}
          animate={{ scale: checked ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          {checked && <Check className="w-3.5 h-3.5 text-ink-paper" strokeWidth={3} />}
        </motion.div>
      </div>
      {label && (
        <span className="text-sm text-ink-black select-none">{label}</span>
      )}
    </label>
  )
}
