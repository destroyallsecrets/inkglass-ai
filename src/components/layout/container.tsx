'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizeStyles = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[90rem]',
  full: 'w-full',
}

export function Container({ children, className, size = 'lg' }: ContainerProps) {
  return (
    <div className={cn('mx-auto px-3 sm:px-4 md:px-6 lg:px-8', sizeStyles[size], className)}>
      {children}
    </div>
  )
}

interface StackProps {
  children: React.ReactNode
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  direction?: 'row' | 'col'
  className?: string
}

const gapStyles = {
  none: '',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

export function Stack({
  children,
  gap = 'md',
  direction = 'col',
  className,
}: StackProps) {
  return (
    <div
      className={cn(
        'flex',
        direction === 'row' ? 'flex-row' : 'flex-col',
        gapStyles[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 6
  gap?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}

const colStyles = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
}

const gridGapStyles = {
  none: 'gap-0',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
}

export function Grid({ children, cols = 3, gap = 'md', className }: GridProps) {
  return (
    <div className={cn('grid', colStyles[cols], gridGapStyles[gap], className)}>
      {children}
    </div>
  )
}
