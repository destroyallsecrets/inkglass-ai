'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  Home,
  MessageSquare,
  Code,
  FileText,
  Image,
  Languages,
  PenTool,
  BarChart3,
  History,
  Bookmark,
  FileCode2,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
} from 'lucide-react'
import { IconButton } from '@/components/ui/button'

interface SidebarProps {
  className?: string
}

interface NavItem {
  id: string
  icon: React.ReactNode
  label: string
  href: string
  badge?: number
}

const mainNavItems: NavItem[] = [
  { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Dashboard', href: '/' },
  { id: 'chat', icon: <MessageSquare className="w-5 h-5" />, label: 'Chat', href: '/chat' },
  { id: 'code', icon: <Code className="w-5 h-5" />, label: 'Code', href: '/code' },
  { id: 'documents', icon: <FileText className="w-5 h-5" />, label: 'Documents', href: '/documents' },
  { id: 'images', icon: <Image className="w-5 h-5" />, label: 'Images', href: '/images' },
  { id: 'translate', icon: <Languages className="w-5 h-5" />, label: 'Translate', href: '/translate' },
  { id: 'write', icon: <PenTool className="w-5 h-5" />, label: 'Write', href: '/write' },
  { id: 'analyze', icon: <BarChart3 className="w-5 h-5" />, label: 'Analyze', href: '/analyze' },
]

const managementNavItems: NavItem[] = [
  { id: 'history', icon: <History className="w-5 h-5" />, label: 'History', href: '/history' },
  { id: 'bookmarks', icon: <Bookmark className="w-5 h-5" />, label: 'Bookmarks', href: '/bookmarks' },
  { id: 'api-docs', icon: <FileCode2 className="w-5 h-5" />, label: 'API Docs', href: '/api-docs' },
]

const bottomNavItems: NavItem[] = [
  { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/settings' },
  { id: 'help', icon: <HelpCircle className="w-5 h-5" />, label: 'Help', href: '/help' },
]

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'h-screen bg-ink-cream border-r border-ink-light/20 flex flex-col',
        className
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ink-black flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-ink-paper" />
            </div>
            <span className="font-serif font-semibold text-lg text-ink-black">InkGlass</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-ink-black flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-ink-paper" />
          </div>
        )}
        <IconButton
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-ink-gray"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </IconButton>
      </div>

      <div className="px-3 mb-4">
        <Link href="/chat">
          <button
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors',
              'bg-ink-black text-ink-paper hover:bg-ink-dark'
            )}
          >
            <Plus className="w-5 h-5" />
            {!isCollapsed && <span className="font-medium">New Chat</span>}
          </button>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 py-2">
            <span className="text-xs font-medium text-ink-gray uppercase tracking-wider">
              AI Tools
            </span>
          </div>
        )}
        {mainNavItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-ink-black text-ink-paper'
                : 'text-ink-gray hover:bg-ink-light/10 hover:text-ink-black'
            )}
          >
            {item.icon}
            {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
            {!isCollapsed && item.badge && (
              <span className="px-2 py-0.5 text-xs bg-ink-light/20 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}

        <div className="pt-4">
          {!isCollapsed && (
            <div className="px-3 py-2">
              <span className="text-xs font-medium text-ink-gray uppercase tracking-wider">
                Management
              </span>
            </div>
          )}
          {managementNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-ink-black text-ink-paper'
                  : 'text-ink-gray hover:bg-ink-light/10 hover:text-ink-black'
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        <div className="pt-4">
          {!isCollapsed && (
            <div className="px-3 py-2">
              <span className="text-xs font-medium text-ink-gray uppercase tracking-wider">
                Account
              </span>
            </div>
          )}
          {bottomNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-ink-light/10 text-ink-black'
                  : 'text-ink-gray hover:bg-ink-light/10 hover:text-ink-black'
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>
    </motion.aside>
  )
}
