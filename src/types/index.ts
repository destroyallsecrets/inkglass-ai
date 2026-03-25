import React from 'react'

export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
export type Size = 'sm' | 'md' | 'lg' | 'xl'
export type Intent = 'default' | 'success' | 'warning' | 'error' | 'info'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'glass' | 'paper' | 'ink'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'solid'
  color?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

export interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  size?: Size
}

export interface ProgressProps {
  value: number
  max?: number
  size?: Size
  color?: 'default' | 'success' | 'warning' | 'error'
  showLabel?: boolean
}

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  duration?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  isLoading?: boolean
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}
