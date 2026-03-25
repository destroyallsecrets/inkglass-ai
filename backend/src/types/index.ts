export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_hash: string;
  last_used_at: string | null;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  model: string;
  temperature: number;
  starred: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokens_used: number;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  starred: number;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: string;
  accent_color: string;
  font_size: string;
  stream_responses: number;
  save_conversations: number;
  reduce_motion: number;
  high_contrast: number;
  paper_texture: number;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  type: string;
  reference_id: string | null;
  created_at: string;
}

export interface Analytics {
  id: string;
  user_id: string;
  tokens_used: number;
  conversations_count: number;
  documents_count: number;
  period: string;
  created_at: string;
}

export interface AuthRequest extends Express.Request {
  user?: {
    id: string;
    email: string;
  };
}
