'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)}>
      <Link
        href="/"
        className="text-ink-gray hover:text-ink-black transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-ink-light" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-ink-gray hover:text-ink-black transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-black font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
