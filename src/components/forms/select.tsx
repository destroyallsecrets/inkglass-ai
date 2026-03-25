'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  disabled,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn('w-full', className)} ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-ink-black mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'w-full px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg',
            'text-left flex items-center justify-between',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-ink-medium/30 focus:border-ink-medium',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500',
            isOpen && 'ring-2 ring-ink-medium/30 border-ink-medium'
          )}
          disabled={disabled}
        >
          <span className={cn(selectedOption ? 'text-ink-black' : 'text-ink-gray')}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className={cn(
              'w-5 h-5 text-ink-gray transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-2 py-2 bg-ink-cream border border-ink-light/30 rounded-lg shadow-lg"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    if (!option.disabled) {
                      onChange?.(option.value)
                      setIsOpen(false)
                    }
                  }}
                  className={cn(
                    'w-full px-4 py-2.5 text-left flex items-center justify-between',
                    'transition-colors duration-150',
                    option.disabled
                      ? 'text-ink-gray cursor-not-allowed'
                      : 'hover:bg-ink-light/10 text-ink-black',
                    option.value === value && 'bg-ink-light/10'
                  )}
                  disabled={option.disabled}
                >
                  <span>{option.label}</span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-ink-black" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  )
}
