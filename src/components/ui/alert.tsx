'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'
import type { Intent } from '@/types'
import { IconButton } from './button'

const alertStyles: Record<Intent, { bg: string; border: string; icon: React.ReactNode; iconColor: string }> = {
  default: {
    bg: 'bg-ink-light/10',
    border: 'border-ink-light/30',
    icon: <Info className="w-5 h-5" />,
    iconColor: 'text-ink-gray',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: <CheckCircle className="w-5 h-5" />,
    iconColor: 'text-green-600',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: <AlertTriangle className="w-5 h-5" />,
    iconColor: 'text-yellow-600',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <AlertCircle className="w-5 h-5" />,
    iconColor: 'text-red-600',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <Info className="w-5 h-5" />,
    iconColor: 'text-blue-600',
  },
}

interface AlertProps {
  title?: string
  children: React.ReactNode
  intent?: Intent
  onClose?: () => void
  className?: string
}

export function Alert({
  title,
  children,
  intent = 'default',
  onClose,
  className,
}: AlertProps) {
  const styles = alertStyles[intent]

  return (
    <div
      className={cn(
        'p-4 rounded-lg border',
        styles.bg,
        styles.border,
        className
      )}
    >
      <div className="flex gap-3">
        <div className={cn('flex-shrink-0 mt-0.5', styles.iconColor)}>
          {styles.icon}
        </div>
        <div className="flex-1">
          {title && (
            <h4 className="font-medium text-ink-black mb-1">{title}</h4>
          )}
          <div className="text-sm text-ink-gray">{children}</div>
        </div>
        {onClose && (
          <IconButton
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="text-ink-gray hover:text-ink-black"
          >
            <X className="w-4 h-4" />
          </IconButton>
        )}
      </div>
    </div>
  )
}
