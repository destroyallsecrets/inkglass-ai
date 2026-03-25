'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  className?: string
}

export function Tabs({ tabs, defaultTab, onChange, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeIndex = tabs.findIndex((t) => t.id === activeTab)

  return (
    <div className={cn('w-full', className)}>
      <div className="relative flex border-b border-ink-light/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'relative px-4 py-3 text-sm font-medium transition-colors duration-200',
              'focus:outline-none',
              activeTab === tab.id
                ? 'text-ink-black'
                : 'text-ink-gray hover:text-ink-black'
            )}
          >
            <span className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        ))}
        <motion.div
          initial={false}
          animate={{ x: activeIndex * 100 + '%', width: `${100 / tabs.length}%` }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          className="absolute bottom-0 left-0 h-0.5 bg-ink-black"
        />
      </div>
      <div className="mt-6">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  )
}
