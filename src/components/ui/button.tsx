'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Variant, Size } from '@/types'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-ink-black text-ink-paper hover:bg-ink-medium shadow-ink hover:shadow-none',
  secondary: 'bg-ink-light/20 text-ink-black border border-ink-light/30 hover:bg-ink-light/30',
  outline: 'bg-transparent border-2 border-ink-black text-ink-black hover:bg-ink-black hover:text-ink-paper',
  ghost: 'bg-transparent text-ink-black hover:bg-ink-light/10',
  destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-ink hover:shadow-none',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-5 py-2.5 text-base rounded-lg gap-2',
  lg: 'px-7 py-3.5 text-lg rounded-xl gap-2.5',
  xl: 'px-9 py-4 text-xl rounded-2xl gap-3',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  type = 'button',
  onClick,
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed hover:transform-none',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
    </motion.button>
  )
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function IconButton({
  children,
  variant = 'ghost',
  size = 'md',
  className,
  type = 'button',
  onClick,
}: IconButtonProps) {
  const iconSizeStyles: Record<Size, string> = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-all duration-200',
        variantStyles[variant],
        iconSizeStyles[size],
        className
      )}
    >
      {children}
    </motion.button>
  )
}
