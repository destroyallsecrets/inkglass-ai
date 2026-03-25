export interface CodeSnippet {
  id: string
  title: string
  code: string
  language: string
  tags: string[]
  description?: string
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = 'inkglass-code-snippets'

export const getSnippets = (): CodeSnippet[] => {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const saveSnippet = (snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>): CodeSnippet => {
  const snippets = getSnippets()
  const now = Date.now()
  const newSnippet: CodeSnippet = {
    ...snippet,
    id: `snippet_${now}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
    updatedAt: now,
  }
  snippets.unshift(newSnippet)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
  return newSnippet
}

export const updateSnippet = (id: string, updates: Partial<Omit<CodeSnippet, 'id' | 'createdAt'>>): CodeSnippet | null => {
  const snippets = getSnippets()
  const index = snippets.findIndex(s => s.id === id)
  if (index === -1) return null
  
  snippets[index] = { ...snippets[index], ...updates, updatedAt: Date.now() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
  return snippets[index]
}

export const deleteSnippet = (id: string): boolean => {
  const snippets = getSnippets()
  const filtered = snippets.filter(s => s.id !== id)
  if (filtered.length === snippets.length) return false
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return true
}

export const searchSnippets = (query: string): CodeSnippet[] => {
  const snippets = getSnippets()
  const lower = query.toLowerCase()
  return snippets.filter(s => 
    s.title.toLowerCase().includes(lower) ||
    s.code.toLowerCase().includes(lower) ||
    s.tags.some(t => t.toLowerCase().includes(lower)) ||
    s.description?.toLowerCase().includes(lower)
  )
}

export const getSnippetsByLanguage = (language: string): CodeSnippet[] => {
  return getSnippets().filter(s => s.language === language)
}

export const getSnippetsByTag = (tag: string): CodeSnippet[] => {
  return getSnippets().filter(s => s.tags.includes(tag))
}

export const getAllTags = (): string[] => {
  const snippets = getSnippets()
  const tags = new Set<string>()
  snippets.forEach(s => s.tags.forEach(t => tags.add(t)))
  return Array.from(tags).sort()
}

export const getAllLanguages = (): string[] => {
  const snippets = getSnippets()
  const languages = new Set<string>()
  snippets.forEach(s => languages.add(s.language))
  return Array.from(languages).sort()
}

export const exportSnippets = (): string => {
  return JSON.stringify(getSnippets(), null, 2)
}

export const importSnippets = (json: string): number => {
  try {
    const imported = JSON.parse(json) as CodeSnippet[]
    if (!Array.isArray(imported)) return 0
    
    const existing = getSnippets()
    const existingIds = new Set(existing.map(s => s.id))
    const newSnippets = imported.filter(s => !existingIds.has(s.id))
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...newSnippets, ...existing]))
    return newSnippets.length
  } catch {
    return 0
  }
}

export const clearAllSnippets = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}
