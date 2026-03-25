'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface HeaderProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

export function Header({ title, subtitle, actions, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 sm:py-6 border-b border-ink-light/20',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        {title && (
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-serif font-bold tracking-tight truncate"
          >
            {title}
          </motion.h1>
        )}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-ink-gray mt-1 text-sm sm:text-base"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">{actions}</div>}
    </header>
  )
}

interface PageProps {
  children: React.ReactNode
  className?: string
}

export function Page({ children, className }: PageProps) {
  return (
    <main className={cn('min-h-screen bg-ink-paper paper-texture pt-14 lg:pt-0', className)}>
      {children}
    </main>
  )
}

interface SectionProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

export function Section({ children, title, description, className }: SectionProps) {
  return (
    <section className={cn('py-4 sm:py-6 lg:py-8', className)}>
      {(title || description) && (
        <div className="mb-4 sm:mb-6">
          {title && (
            <h2 className="text-xl sm:text-2xl font-serif font-semibold tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-ink-gray mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}
