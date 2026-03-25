import { createHash, randomBytes, scryptSync, createCipheriv, createDecipheriv } from 'crypto';

export function hashPassword(password: string): string {
  return scryptSync(password, 'salt', 32).toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  try {
    const [salt, key] = hash.split(':');
    const hashedBuffer = scryptSync(password, salt, 32);
    return hashedBuffer.toString('hex') === key;
  } catch {
    return false;
  }
}

export interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeAmbiguous?: boolean
  customSymbols?: string
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const AMBIGUOUS = 'l1IO0'

export function generatePassword(options: PasswordOptions): string {
  let charset = ''
  const required: string[] = []
  
  if (options.uppercase) {
    let chars = UPPERCASE
    if (options.excludeAmbiguous) {
      chars = chars.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
    }
    charset += chars
    required.push(chars[Math.floor(Math.random() * chars.length)])
  }
  
  if (options.lowercase) {
    let chars = LOWERCASE
    if (options.excludeAmbiguous) {
      chars = chars.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
    }
    charset += chars
    required.push(chars[Math.floor(Math.random() * chars.length)])
  }
  
  if (options.numbers) {
    let chars = NUMBERS
    if (options.excludeAmbiguous) {
      chars = chars.split('').filter(c => !AMBIGUOUS.includes(c)).join('')
    }
    charset += chars
    required.push(chars[Math.floor(Math.random() * chars.length)])
  }
  
  if (options.symbols) {
    const syms = options.customSymbols || SYMBOLS
    charset += syms
    required.push(syms[Math.floor(Math.random() * syms.length)])
  }
  
  if (charset.length === 0) {
    charset = LOWERCASE
  }
  
  let password = required.join('')
  const remainingLength = Math.max(0, options.length - required.length)
  
  for (let i = 0; i < remainingLength; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

export function generatePassphrase(wordCount: number = 4, separator: string = '-'): string {
  const words = [
    'apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'galaxy', 'harbor',
    'island', 'jungle', 'knight', 'lemon', 'mountain', 'nectar', 'ocean', 'panda',
    'quartz', 'river', 'sunset', 'thunder', 'umbrella', 'valley', 'whisper', 'xylophone',
    'yellow', 'zebra', 'anchor', 'breeze', 'castle', 'diamond', 'ember', 'falcon',
    'garden', 'horizon', 'ivory', 'jasmine', 'kindle', 'lantern', 'marble', 'nebula',
    'orchid', 'phoenix', 'quill', 'raven', 'silver', 'timber', 'unity', 'velvet',
    'winter', 'crystal', 'aurora', 'blossom', 'canyon', 'dolphin', 'eclipse',
  ]
  
  const selected: string[] = []
  for (let i = 0; i < wordCount; i++) {
    const word = words[Math.floor(Math.random() * words.length)]
    selected.push(word)
  }
  
  return selected.join(separator)
}

export interface PasswordStrength {
  score: number
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong'
  color: string
  feedback: string[]
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = []
  let score = 0
  
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1
  
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Add lowercase letters')
  
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Add uppercase letters')
  
  if (/[0-9]/.test(password)) score += 1
  else feedback.push('Add numbers')
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 1
  else feedback.push('Add special characters')
  
  if (/(.)\1{2,}/.test(password)) {
    score -= 1
    feedback.push('Avoid repeated characters')
  }
  
  const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome']
  if (commonPasswords.includes(password.toLowerCase())) {
    score = 1
    feedback.push('This is a commonly used password')
  }
  
  score = Math.max(0, Math.min(8, score))
  
  let label: PasswordStrength['label']
  let color: string
  
  if (score <= 2) {
    label = 'Very Weak'
    color = '#ef4444'
  } else if (score <= 3) {
    label = 'Weak'
    color = '#f97316'
  } else if (score <= 5) {
    label = 'Fair'
    color = '#eab308'
  } else if (score <= 6) {
    label = 'Strong'
    color = '#22c55e'
  } else {
    label = 'Very Strong'
    color = '#10b981'
  }
  
  if (score < 5) {
    feedback.unshift('Make the password longer')
  }
  
  return {
    score,
    label,
    color,
    feedback: feedback.slice(0, 3),
  }
}

export function encrypt(text: string, key: string): string {
  const iv = randomBytes(16)
  const keyHash = createHash('sha256').update(key).digest()
  const cipher = createCipheriv('aes-256-cbc', keyHash, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

export function decrypt(encrypted: string, key: string): string {
  try {
    const [ivHex, content] = encrypted.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const keyHash = createHash('sha256').update(key).digest()
    const decipher = createDecipheriv('aes-256-cbc', keyHash, iv)
    let decrypted = decipher.update(content, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch {
    return ''
  }
}

export function hash(type: 'md5' | 'sha1' | 'sha256' | 'sha512', text: string): string {
  return createHash(type).update(text).digest('hex')
}

export function base64Encode(text: string): string {
  return Buffer.from(text, 'utf8').toString('base64')
}

export function base64Decode(encoded: string): string {
  return Buffer.from(encoded, 'base64').toString('utf8')
}

export function base64UrlEncode(text: string): string {
  return base64Encode(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function base64UrlDecode(encoded: string): string {
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  return base64Decode(base64)
}

export function isValidBase64(text: string): boolean {
  try {
    return btoa(atob(text)) === text
  } catch {
    return false
  }
}

export interface ColorFormat {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  hslString: string
  rgbString: string
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360
  s /= 100
  l /= 100
  
  let r, g, b
  
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

export function parseColor(input: string): ColorFormat | null {
  let r = 0, g = 0, b = 0
  
  const hexMatch = input.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (hexMatch) {
    r = parseInt(hexMatch[1], 16)
    g = parseInt(hexMatch[2], 16)
    b = parseInt(hexMatch[3], 16)
  } else {
    const rgbMatch = input.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
    if (rgbMatch) {
      r = parseInt(rgbMatch[1])
      g = parseInt(rgbMatch[2])
      b = parseInt(rgbMatch[3])
    } else {
      const hslMatch = input.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/)
      if (hslMatch) {
        const rgb = hslToRgb(parseInt(hslMatch[1]), parseInt(hslMatch[2]), parseInt(hslMatch[3]))
        r = rgb.r
        g = rgb.g
        b = rgb.b
      } else {
        return null
      }
    }
  }
  
  const hsl = rgbToHsl(r, g, b)
  
  return {
    hex: rgbToHex(r, g, b),
    rgb: { r, g, b },
    hsl,
    hslString: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    rgbString: `rgb(${r}, ${g}, ${b})`,
  }
}

export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  if (!rgb1 || !rgb2) return 0
  
  const luminance = (rgb: { r: number; g: number; b: number }) => {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  
  const l1 = luminance(rgb1)
  const l2 = luminance(rgb2)
  
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

export function getWCAGLevel(ratio: number): 'AAA' | 'AA' | 'Fail' {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'Fail'
}

export function generateShades(hex: string, count: number = 9): string[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []
  
  const shades: string[] = []
  for (let i = 0; i < count; i++) {
    const factor = i / (count - 1)
    const r = Math.round(rgb.r + (255 - rgb.r) * factor)
    const g = Math.round(rgb.g + (255 - rgb.g) * factor)
    const b = Math.round(rgb.b + (255 - rgb.b) * factor)
    shades.push(rgbToHex(r, g, b))
  }
  
  return shades
}

export function generateTints(hex: string, count: number = 9): string[] {
  const rgb = hexToRgb(hex)
  if (!rgb) return []
  
  const tints: string[] = []
  for (let i = 0; i < count; i++) {
    const factor = i / (count - 1)
    const r = Math.round(rgb.r * (1 - factor))
    const g = Math.round(rgb.g * (1 - factor))
    const b = Math.round(rgb.b * (1 - factor))
    tints.push(rgbToHex(r, g, b))
  }
  
  return tints
}

export function generateComplementary(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b)
}

export function generateTriadic(hex: string): [string, string] {
  const hsl = rgbToHsl(...Object.values(hexToRgb(hex) || { r: 0, g: 0, b: 0 }) as [number, number, number])
  
  const hsl1 = { h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l }
  const hsl2 = { h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l }
  
  const rgb1 = hslToRgb(hsl1.h, hsl1.s, hsl1.l)
  const rgb2 = hslToRgb(hsl2.h, hsl2.s, hsl2.l)
  
  return [rgbToHex(rgb1.r, rgb1.g, rgb1.b), rgbToHex(rgb2.r, rgb2.g, rgb2.b)]
}

export interface RegexMatch {
  match: string
  index: number
  groups: string[]
}

export function testRegex(pattern: string, flags: string, text: string): { 
  valid: boolean
  error?: string
  matches: RegexMatch[]
  matchCount: number
} {
  try {
    const regex = new RegExp(pattern, flags)
    const matches: RegexMatch[] = []
    
    if (flags.includes('g')) {
      let match
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        })
        if (match.index === regex.lastIndex) {
          regex.lastIndex++
        }
      }
    } else {
      const match = regex.exec(text)
      if (match) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        })
      }
    }
    
    return {
      valid: true,
      matches,
      matchCount: matches.length,
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid regex',
      matches: [],
      matchCount: 0,
    }
  }
}

export function replaceWithRegex(pattern: string, flags: string, text: string, replacement: string): {
  valid: boolean
  error?: string
  result: string
  replaceCount: number
} {
  try {
    const regex = new RegExp(pattern, flags)
    const result = text.replace(regex, replacement)
    const matches = text.match(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))
    
    return {
      valid: true,
      result,
      replaceCount: matches?.length || 0,
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid regex',
      result: text,
      replaceCount: 0,
    }
  }
}

export function explainRegex(pattern: string): string[] {
  const explanations: string[] = []
  
  const rules: [RegExp, string][] = [
    [/^\\/, 'Escaped character'],
    [/^\^/, 'Start of string/line'],
    [/^\$/, 'End of string/line'],
    [/^\./, 'Any character except newline'],
    [/^\*/, 'Zero or more of previous'],
    [/^\+/, 'One or more of previous'],
    [/^\?/, 'Zero or one of previous (optional)'],
    [/^\{(\d+)(,)?(\d+)?\}/, 'Repetition count'],
    [/^\[\^?/, 'Character class'],
    [/^\(/, 'Start of capture group'],
    [/^\)/, 'End of capture group'],
    [/^\|/, 'Alternation (OR)'],
    [/^\b/, 'Word boundary'],
    [/^\B/, 'Non-word boundary'],
    [/^\\d/, 'Any digit [0-9]'],
    [/^\\D/, 'Any non-digit'],
    [/^\\w/, 'Any word character [a-zA-Z0-9_]'],
    [/^\\W/, 'Any non-word character'],
    [/^\\s/, 'Any whitespace'],
    [/^\\S/, 'Any non-whitespace'],
  ]
  
  let remaining = pattern
  while (remaining.length > 0) {
    let matched = false
    for (const [regex, explanation] of rules) {
      const match = remaining.match(regex)
      if (match) {
        explanations.push(`${match[0]} → ${explanation}`)
        remaining = remaining.slice(match[0].length)
        matched = true
        break
      }
    }
    if (!matched) {
      explanations.push(`${remaining[0]} → Literal character`)
      remaining = remaining.slice(1)
    }
  }
  
  return explanations
}

export const COMMON_REGEX_PATTERNS = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: 'URL', pattern: 'https?:\\/\\/[\\w\\-._~:/?#[\\]@!$&\'()*+,;=%]+' },
  { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
  { name: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])' },
  { name: 'Date (MM/DD/YYYY)', pattern: '(?:0[1-9]|1[0-2])\\/(?:0[1-9]|[12]\\d|3[01])\\/\\d{4}' },
  { name: 'Time (HH:MM)', pattern: '(?:[01]\\d|2[0-3]):[0-5]\\d' },
  { name: 'Hex Color', pattern: '#(?:[a-fA-F0-9]{6}|[a-fA-F0-9]{3})' },
  { name: 'Credit Card', pattern: '\\b(?:\\d{4}[- ]?){3}\\d{4}\\b' },
  { name: 'UUID', pattern: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' },
  { name: 'ZIP Code (US)', pattern: '\\b\\d{5}(?:-\\d{4})?\\b' },
  { name: 'Username', pattern: '[a-zA-Z][a-zA-Z0-9_-]{2,15}' },
  { name: 'Strong Password', pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}' },
  { name: 'HTML Tag', pattern: '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)' },
  { name: 'Slug', pattern: '[a-z0-9]+(?:-[a-z0-9]+)*' },
]

export interface JsonToolResult {
  valid: boolean
  error?: string
  formatted?: string
  minified?: string
  json?: object
}

export function parseJson(input: string): JsonToolResult {
  try {
    const json = JSON.parse(input)
    return { valid: true, json }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    }
  }
}

export function formatJson(input: string, indent: number = 2): JsonToolResult {
  try {
    const json = JSON.parse(input)
    const formatted = JSON.stringify(json, null, indent)
    return { valid: true, json, formatted }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    }
  }
}

export function minifyJson(input: string): JsonToolResult {
  try {
    const json = JSON.parse(input)
    const minified = JSON.stringify(json)
    return { valid: true, json, minified }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    }
  }
}

export function jsonToTypeScript(input: string, interfaceName: string = 'Root'): JsonToolResult & { typescript?: string } {
  try {
    const json = JSON.parse(input)
    
    function generateType(obj: unknown, name: string, required: boolean = true): string {
      if (obj === null) return 'null'
      if (obj === undefined) return 'undefined'
      
      if (typeof obj === 'string') return 'string'
      if (typeof obj === 'number') return 'number'
      if (typeof obj === 'boolean') return 'boolean'
      
      if (Array.isArray(obj)) {
        if (obj.length === 0) return `${generateType({}, name + 'Item')}[]`
        const itemTypes = [...new Set(obj.map((item, i) => generateType(item, `${name}Item${i}`)))]
        return `(${itemTypes.join(' | ')})[]`
      }
      
      if (typeof obj === 'object') {
        const entries = Object.entries(obj as Record<string, unknown>)
        if (entries.length === 0) return 'Record<string, never>'
        
        const properties = entries.map(([key, value]) => {
          const type = generateType(value, name + capitalize(key))
          const optional = !required ? '?' : ''
          const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`
          return `  ${safeKey}${optional}: ${type}`
        })
        
        return `{\n${properties.join('\n')}\n}`
      }
      
      return 'unknown'
    }
    
    function capitalize(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    
    const typescript = `interface ${interfaceName} ${generateType(json, interfaceName)}`
    
    return { valid: true, json, typescript }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    }
  }
}

export function jsonToCsv(input: string): JsonToolResult & { csv?: string } {
  try {
    const json = JSON.parse(input)
    
    if (!Array.isArray(json)) {
      return {
        valid: false,
        error: 'JSON must be an array of objects to convert to CSV',
      }
    }
    
    if (json.length === 0) {
      return { valid: true, json, csv: '' }
    }
    
    const headers = [...new Set(json.flatMap(obj => Object.keys(obj)))]
    
    const escape = (value: unknown): string => {
      const str = String(value ?? '')
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }
    
    const rows = json.map(obj =>
      headers.map(h => escape((obj as Record<string, unknown>)[h])).join(',')
    )
    
    const csv = [headers.join(','), ...rows].join('\n')
    
    return { valid: true, json, csv }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    }
  }
}

export function csvToJson(csv: string): JsonToolResult & { json?: unknown[] } {
  try {
    const lines = csv.trim().split('\n')
    if (lines.length === 0) {
      return { valid: true, json: [] }
    }
    
    const headers = lines[0].split(',').map(h => h.trim())
    
    const rows = lines.slice(1).map(line => {
      const values: string[] = []
      let current = ''
      let inQuotes = false
      
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())
      
      const obj: Record<string, string> = {}
      headers.forEach((header, i) => {
        obj[header] = values[i] || ''
      })
      return obj
    })
    
    return { valid: true, json: rows }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid CSV',
    }
  }
}

export function jsonPath(input: string, path: string): JsonToolResult & { result?: unknown } {
  try {
    const json = JSON.parse(input)
    
    const parts = path.replace(/^\$\.?/, '').split(/\.|\[|\]/).filter(Boolean)
    let result: unknown = json
    
    for (const part of parts) {
      if (result === null || result === undefined) {
        return { valid: true, json, result: undefined }
      }
      
      if (typeof result === 'object' && !Array.isArray(result)) {
        result = (result as Record<string, unknown>)[part]
      } else if (Array.isArray(result)) {
        const index = parseInt(part, 10)
        result = result[index]
      } else {
        return { valid: true, json, result: undefined }
      }
    }
    
    return { valid: true, json, result }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON or path',
    }
  }
}
