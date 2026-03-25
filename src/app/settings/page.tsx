'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout'
import { Container } from '@/components/layout'
import { Header, Page, Section } from '@/components/layout'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Tabs,
  Avatar,
  Alert,
} from '@/components/ui'
import { Select, Toggle } from '@/components/forms'
import { useAuth } from '@/lib/auth'
import api from '@/lib/api'
import {
  User,
  Key,
  Bell,
  Palette,
  Sun,
  Moon,
  Monitor,
  Save,
  Upload,
  Trash2,
  Plus,
} from 'lucide-react'

export default function SettingsPage() {
  const { user, token, updateUser } = useAuth()
  const [theme, setTheme] = useState('light')
  const [settings, setSettings] = useState<any>(null)
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [newApiKeyName, setNewApiKeyName] = useState('')
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [newApiKey, setNewApiKey] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (token) {
      loadSettings()
      loadApiKeys()
    }
  }, [token])

  const loadSettings = async () => {
    if (!token) return
    try {
      const data = await api.settings.get(token)
      setSettings(data)
      setTheme(data.theme || 'light')
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const loadApiKeys = async () => {
    if (!token) return
    try {
      const data = await api.settings.getApiKeys(token)
      setApiKeys(data)
    } catch (error) {
      console.error('Failed to load API keys:', error)
    }
  }

  const handleSaveSettings = async () => {
    if (!token) return
    setIsSaving(true)
    try {
      await api.settings.update(token, {
        theme,
        accent_color: settings?.accent_color || '#000000',
        font_size: settings?.font_size || 'md',
        stream_responses: settings?.stream_responses ? 1 : 0,
        save_conversations: settings?.save_conversations ? 1 : 0,
        reduce_motion: settings?.reduce_motion ? 1 : 0,
        high_contrast: settings?.high_contrast ? 1 : 0,
        paper_texture: settings?.paper_texture ? 1 : 0,
      })
      await loadSettings()
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateApiKey = async () => {
    if (!token || !newApiKeyName) return
    try {
      const result = await api.settings.createApiKey(token, { name: newApiKeyName })
      setNewApiKey(result.key)
      setNewApiKeyName('')
      await loadApiKeys()
    } catch (error) {
      console.error('Failed to create API key:', error)
    }
  }

  const handleDeleteApiKey = async (id: string) => {
    if (!token) return
    try {
      await api.settings.deleteApiKey(token, id)
      await loadApiKeys()
    } catch (error) {
      console.error('Failed to delete API key:', error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await updateUser({
      name: formData.get('name') as string,
      bio: formData.get('bio') as string,
    })
  }

  const settingsTabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      content: (
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar size="xl" fallback={user?.name?.[0] || 'U'} />
            <div>
              <Button variant="secondary" size="sm" type="button">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-sm text-ink-gray mt-2">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" name="name" defaultValue={user?.name || ''} />
            <Input label="Email" type="email" defaultValue={user?.email} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-black mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              defaultValue={user?.bio || ''}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 bg-ink-cream/50 border border-ink-light/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-ink-medium/30"
              rows={3}
            />
          </div>

          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </form>
      ),
    },
    {
      id: 'api',
      label: 'API Keys',
      icon: <Key className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <Alert title="Keep your API keys secure" intent="warning">
            API keys give full access to your account. Never share them publicly.
          </Alert>

          {newApiKey && (
            <Alert title="API Key Created" intent="success">
              <p className="mb-2">Copy your new API key now. You won&apos;t be able to see it again.</p>
              <code className="block bg-ink-light/10 p-2 rounded text-sm break-all">{newApiKey}</code>
            </Alert>
          )}

          <div className="space-y-4">
            {apiKeys.map((key) => (
              <Card key={key.id} variant="paper" padding="md">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{key.name}</h4>
                    <p className="text-sm text-ink-gray mt-1">
                      Created {new Date(key.created_at).toLocaleDateString()}
                    </p>
                    {key.last_used_at && (
                      <p className="text-xs text-ink-light">
                        Last used {new Date(key.last_used_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteApiKey(key.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            <Input
              placeholder="API key name"
              value={newApiKeyName}
              onChange={(e) => setNewApiKeyName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCreateApiKey}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Key
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: <Palette className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink-black mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'light', label: 'Light', icon: <Sun className="w-5 h-5" /> },
                { id: 'dark', label: 'Dark', icon: <Moon className="w-5 h-5" /> },
                { id: 'system', label: 'System', icon: <Monitor className="w-5 h-5" /> },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setTheme(option.id)
                    handleSaveSettings()
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    theme === option.id
                      ? 'border-ink-black bg-ink-light/10'
                      : 'border-ink-light/20 hover:border-ink-light/40'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {option.icon}
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-black mb-3">
              Accent Color
            </label>
            <div className="flex gap-3">
              {['#000000', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'].map((color) => (
                <button
                  key={color}
                  className="w-10 h-10 rounded-full border-2 border-transparent hover:border-ink-gray transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setSettings((prev: any) => ({ ...prev, accent_color: color }))
                  }}
                />
              ))}
            </div>
          </div>

          <Select
            label="Font Size"
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium (Recommended)' },
              { value: 'lg', label: 'Large' },
              { value: 'xl', label: 'Extra Large' },
            ]}
            value={settings?.font_size || 'md'}
            onChange={(value) => {
              setSettings((prev: any) => ({ ...prev, font_size: value }))
              handleSaveSettings()
            }}
          />

          <div className="space-y-4">
            <Toggle
              label="Reduce motion"
              checked={settings?.reduce_motion === 1}
              onChange={(checked) => {
                setSettings((prev: any) => ({ ...prev, reduce_motion: checked ? 1 : 0 }))
                handleSaveSettings()
              }}
            />
            <Toggle
              label="Use high contrast text"
              checked={settings?.high_contrast === 1}
              onChange={(checked) => {
                setSettings((prev: any) => ({ ...prev, high_contrast: checked ? 1 : 0 }))
                handleSaveSettings()
              }}
            />
            <Toggle
              label="Show paper texture background"
              checked={settings?.paper_texture !== 0}
              onChange={(checked) => {
                setSettings((prev: any) => ({ ...prev, paper_texture: checked ? 1 : 0 }))
                handleSaveSettings()
              }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: <Bell className="w-4 h-4" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">AI Preferences</h4>
            <div className="space-y-4 pl-4 border-l-2 border-ink-light/20">
              <Toggle
                label="Stream responses"
                checked={settings?.stream_responses === 1}
                onChange={(checked) => {
                  setSettings((prev: any) => ({ ...prev, stream_responses: checked ? 1 : 0 }))
                  handleSaveSettings()
                }}
              />
              <Toggle
                label="Save conversations"
                checked={settings?.save_conversations !== 0}
                onChange={(checked) => {
                  setSettings((prev: any) => ({ ...prev, save_conversations: checked ? 1 : 0 }))
                  handleSaveSettings()
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Notifications</h4>
            <div className="space-y-4 pl-4 border-l-2 border-ink-light/20">
              <Toggle label="Email notifications" checked />
              <Toggle label="Push notifications" checked />
              <Toggle label="Weekly summary" />
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Page className="flex-1">
        <Container>
          <Header
            title="Settings"
            subtitle="Manage your account preferences"
          />

          <Section>
            <Tabs tabs={settingsTabs} />
          </Section>
        </Container>
      </Page>
    </div>
  )
}
