const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  auth = {
    register: (data: { email: string; password: string; name?: string }) =>
      this.fetch<{ token: string; user: any; message: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    
    login: (data: { email: string; password: string }) =>
      this.fetch<{ token: string; user: any; message: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    
    getMe: (token: string) =>
      this.fetch<any>('/auth/me', { token }),
    
    updateProfile: (token: string, data: { name?: string; bio?: string; avatar_url?: string }) =>
      this.fetch<any>('/auth/me', { token, method: 'PATCH', body: JSON.stringify(data) }),
    
    changePassword: (token: string, data: { currentPassword: string; newPassword: string }) =>
      this.fetch<{ message: string }>('/auth/change-password', { token, method: 'POST', body: JSON.stringify(data) }),
  };

  chat = {
    chat: (token: string, data: { message: string; sessionId?: string; history?: any[] }) =>
      this.fetch<{ sessionId: string; response: string; messageId: string }>('/chat/chat', { token, method: 'POST', body: JSON.stringify(data) }),
    
    getSessions: (token: string) =>
      this.fetch<any[]>('/chat/sessions', { token }),
    
    getSession: (token: string, id: string) =>
      this.fetch<any>(`/chat/sessions/${id}`, { token }),
    
    createSession: (token: string, data: { title?: string; model?: string; temperature?: number }) =>
      this.fetch<any>('/chat/sessions', { token, method: 'POST', body: JSON.stringify(data) }),
    
    updateSession: (token: string, id: string, data: { title?: string; model?: string; temperature?: number; starred?: number }) =>
      this.fetch<any>(`/chat/sessions/${id}`, { token, method: 'PATCH', body: JSON.stringify(data) }),
    
    deleteSession: (token: string, id: string) =>
      this.fetch<{ message: string }>(`/chat/sessions/${id}`, { token, method: 'DELETE' }),
    
    addMessage: (token: string, sessionId: string, data: { role: string; content: string }) =>
      this.fetch<any>(`/chat/sessions/${sessionId}/messages`, { token, method: 'POST', body: JSON.stringify(data) }),
    
    deleteMessage: (token: string, sessionId: string, messageId: string) =>
      this.fetch<{ message: string }>(`/chat/sessions/${sessionId}/messages/${messageId}`, { token, method: 'DELETE' }),
    
    searchSessions: (token: string, query: string) =>
      this.fetch<any[]>(`/chat/sessions/search?q=${encodeURIComponent(query)}`, { token }),
  };

  documents = {
    getAll: (token: string) =>
      this.fetch<any[]>('/documents', { token }),
    
    getOne: (token: string, id: string) =>
      this.fetch<any>(`/documents/${id}`, { token }),
    
    create: (token: string, data: { name: string; type: string; size: number; content?: string }) =>
      this.fetch<any>('/documents', { token, method: 'POST', body: JSON.stringify(data) }),
    
    update: (token: string, id: string, data: { name?: string; content?: string; starred?: number }) =>
      this.fetch<any>(`/documents/${id}`, { token, method: 'PATCH', body: JSON.stringify(data) }),
    
    delete: (token: string, id: string) =>
      this.fetch<{ message: string }>(`/documents/${id}`, { token, method: 'DELETE' }),
    
    search: (token: string, query: string) =>
      this.fetch<any[]>(`/documents/search?q=${encodeURIComponent(query)}`, { token }),
  };

  settings = {
    get: (token: string) =>
      this.fetch<any>('/settings/settings', { token }),
    
    update: (token: string, data: any) =>
      this.fetch<any>('/settings/settings', { token, method: 'PATCH', body: JSON.stringify(data) }),
    
    getApiKeys: (token: string) =>
      this.fetch<any[]>('/settings/api-keys', { token }),
    
    createApiKey: (token: string, data: { name: string }) =>
      this.fetch<any>('/settings/api-keys', { token, method: 'POST', body: JSON.stringify(data) }),
    
    deleteApiKey: (token: string, id: string) =>
      this.fetch<{ message: string }>(`/settings/api-keys/${id}`, { token, method: 'DELETE' }),
  };

  bookmarks = {
    getAll: (token: string, type?: string) =>
      this.fetch<any[]>(`/bookmarks${type ? `?type=${type}` : ''}`, { token }),
    
    create: (token: string, data: { title: string; content?: string; type: string; reference_id?: string }) =>
      this.fetch<any>('/bookmarks', { token, method: 'POST', body: JSON.stringify(data) }),
    
    delete: (token: string, id: string) =>
      this.fetch<{ message: string }>(`/bookmarks/${id}`, { token, method: 'DELETE' }),
  };

  analytics = {
    getStats: (token: string) =>
      this.fetch<any>('/analytics/stats', { token }),
    
    recordUsage: (token: string, data: { tokens_used?: number; type: string }) =>
      this.fetch<{ message: string }>('/analytics/usage', { token, method: 'POST', body: JSON.stringify(data) }),
  };
}

export const api = new ApiClient(API_BASE);
export default api;
