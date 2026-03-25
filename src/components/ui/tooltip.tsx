'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import type { TooltipProps } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

const positionStyles = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

const arrowStyles = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-ink-dark border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-ink-dark border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-ink-dark border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-ink-dark border-y-transparent border-l-transparent',
}

export function Tooltip({
  content,
  children,
  position = 'top',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 px-3 py-2 text-sm bg-ink-dark text-ink-paper rounded-lg shadow-lg',
              'whitespace-nowrap pointer-events-none',
              positionStyles[position]
            )}
          >
            {content}
            <div
              className={cn(
                'absolute w-0 h-0 border-4',
                arrowStyles[position]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
