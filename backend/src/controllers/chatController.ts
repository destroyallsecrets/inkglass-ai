import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';
import type { ChatSession, Message } from '../types';

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1';

async function getAIResponse(messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;
  
  if (!apiKey || apiKey === 'nvapi-your-api-key-here') {
    return getSimulatedResponse(messages[messages.length - 1]?.content || '');
  }

  try {
    const response = await fetch(`${NVIDIA_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-nano-30b-a3b:free',
        messages: messages,
        temperature: 0.6,
        max_tokens: 1024,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API error:', response.status, errorText);
      return getSimulatedResponse(messages[messages.length - 1]?.content || '');
    }

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.';
  } catch (error) {
    console.error('NVIDIA API fetch error:', error);
    return getSimulatedResponse(messages[messages.length - 1]?.content || '');
  }
}

function getSimulatedResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('code') || lowerMessage.includes('function') || lowerMessage.includes('bug')) {
    return `I can help you with code! Here's a general example:\n\n\`\`\`javascript\nfunction greet(name) {\n  return \`Hello, \${name}! How can I help you today?\`;\n}\n\`\`\`\n\nWhat specific coding task would you like assistance with?`;
  }
  
  if (lowerMessage.includes('write') || lowerMessage.includes('essay') || lowerMessage.includes('article')) {
    return `I'd be happy to help with your writing! Here's a structured approach:\n\n1. **Introduction** - Start with a hook to grab attention\n2. **Body** - Develop your main points with supporting evidence\n3. **Conclusion** - Summarize and leave a lasting impression\n\nWhat topic would you like to write about?`;
  }
  
  if (lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('how does')) {
    return `That's a great question! Let me break this down:\n\n**Key Points:**\n- The concept involves several interconnected parts\n- Understanding the fundamentals is crucial\n- Practical application comes with practice\n\nWould you like me to elaborate on any specific aspect?`;
  }
  
  if (lowerMessage.includes('help')) {
    return `I'm here to help! I can assist you with:\n\n- **Coding** - Write, debug, or explain code\n- **Writing** - Essays, articles, emails\n- **Analysis** - Data, documents, concepts\n- **Translation** - Convert text between languages\n- **Brainstorming** - Generate creative ideas\n\nWhat would you like to work on?`;
  }
  
  const responses = [
    "That's an interesting topic! Could you tell me more about what specific aspect you'd like to explore?",
    "I understand you're asking about this. Let me provide some insights that might help.",
    "Great question! Here's my perspective on this matter.",
    "Thanks for sharing that. I have some thoughts on how to approach this.",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

export const chatController = {
  async getSessions(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const sessions = db.prepare(`
        SELECT cs.*, 
               (SELECT COUNT(*) FROM messages WHERE session_id = cs.id) as message_count
        FROM chat_sessions cs
        WHERE cs.user_id = ?
        ORDER BY cs.updated_at DESC
      `).all(userId);

      res.json(sessions);
    } catch (error) {
      console.error('Get sessions error:', error);
      res.status(500).json({ error: 'Failed to get sessions' });
    }
  },

  async getSession(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const session = db.prepare(`
        SELECT * FROM chat_sessions 
        WHERE id = ? AND user_id = ?
      `).get(id, userId) as ChatSession | undefined;

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const messages = db.prepare(`
        SELECT * FROM messages 
        WHERE session_id = ?
        ORDER BY created_at ASC
      `).all(id) as Message[];

      res.json({ ...session, messages });
    } catch (error) {
      console.error('Get session error:', error);
      res.status(500).json({ error: 'Failed to get session' });
    }
  },

  async createSession(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { title, model, temperature } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const id = uuidv4();
      const sessionTitle = title || `Chat ${new Date().toLocaleDateString()}`;

      db.prepare(`
        INSERT INTO chat_sessions (id, user_id, title, model, temperature)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, userId, sessionTitle, model || 'nemotron-3-nano', temperature || 0.6);

      const session = db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(id);

      res.status(201).json(session);
    } catch (error) {
      console.error('Create session error:', error);
      res.status(500).json({ error: 'Failed to create session' });
    }
  },

  async updateSession(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { id } = req.params;
      const { title, model, temperature, starred } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const existing = db.prepare('SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?').get(id, userId);
      if (!existing) {
        return res.status(404).json({ error: 'Session not found' });
      }

      db.prepare(`
        UPDATE chat_sessions 
        SET title = COALESCE(?, title),
            model = COALESCE(?, model),
            temperature = COALESCE(?, temperature),
            starred = COALESCE(?, starred),
            updated_at = datetime('now')
        WHERE id = ? AND user_id = ?
      `).run(title, model, temperature, starred, id, userId);

      const session = db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(id);

      res.json(session);
    } catch (error) {
      console.error('Update session error:', error);
      res.status(500).json({ error: 'Failed to update session' });
    }
  },

  async deleteSession(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const result = db.prepare('DELETE FROM chat_sessions WHERE id = ? AND user_id = ?').run(id, userId);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.json({ message: 'Session deleted successfully' });
    } catch (error) {
      console.error('Delete session error:', error);
      res.status(500).json({ error: 'Failed to delete session' });
    }
  },

  async addMessage(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { id } = req.params;
      const { role, content } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      if (!role || !content) {
        return res.status(400).json({ error: 'Role and content are required' });
      }

      const session = db.prepare('SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?').get(id, userId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const messageId = uuidv4();
      const estimatedTokens = Math.ceil(content.length / 4);

      db.prepare(`
        INSERT INTO messages (id, session_id, role, content, tokens_used)
        VALUES (?, ?, ?, ?, ?)
      `).run(messageId, id, role, content, estimatedTokens);

      db.prepare(`
        UPDATE chat_sessions SET updated_at = datetime('now') WHERE id = ?
      `).run(id);

      const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId);

      res.status(201).json(message);
    } catch (error) {
      console.error('Add message error:', error);
      res.status(500).json({ error: 'Failed to add message' });
    }
  },

  async chat(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { message, sessionId, history } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      let currentSessionId = sessionId;

      if (!currentSessionId) {
        currentSessionId = uuidv4();
        db.prepare(`
          INSERT INTO chat_sessions (id, user_id, title, model, temperature)
          VALUES (?, ?, ?, ?, ?)
        `).run(currentSessionId, userId, message.slice(0, 50) || 'New Chat', 'nemotron-3-nano', 0.6);
      }

      const userMessageId = uuidv4();
      db.prepare(`
        INSERT INTO messages (id, session_id, role, content, tokens_used)
        VALUES (?, ?, ?, ?, ?)
      `).run(userMessageId, currentSessionId, 'user', message, Math.ceil(message.length / 4));

      const existingMessages = db.prepare(`
        SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at ASC
      `).all(currentSessionId) as { role: string; content: string }[];

      const allMessages = [
        { role: 'system', content: 'You are a helpful AI assistant. Provide clear, concise, and useful responses.' },
        ...existingMessages.map(m => ({ role: m.role, content: m.content })),
      ];

      const aiResponse = await getAIResponse(allMessages);

      const assistantMessageId = uuidv4();
      db.prepare(`
        INSERT INTO messages (id, session_id, role, content, tokens_used)
        VALUES (?, ?, ?, ?, ?)
      `).run(assistantMessageId, currentSessionId, 'assistant', aiResponse, Math.ceil(aiResponse.length / 4));

      db.prepare(`
        UPDATE chat_sessions SET updated_at = datetime('now') WHERE id = ?
      `).run(currentSessionId);

      res.json({
        sessionId: currentSessionId,
        response: aiResponse,
        messageId: assistantMessageId,
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  },

  async deleteMessage(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { id, messageId } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const session = db.prepare('SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?').get(id, userId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const result = db.prepare('DELETE FROM messages WHERE id = ? AND session_id = ?').run(messageId, id);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }

      res.json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Delete message error:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  },

  async searchSessions(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { q } = req.query;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const sessions = db.prepare(`
        SELECT DISTINCT cs.* 
        FROM chat_sessions cs
        LEFT JOIN messages m ON cs.id = m.session_id
        WHERE cs.user_id = ? 
          AND (cs.title LIKE ? OR m.content LIKE ?)
        ORDER BY cs.updated_at DESC
        LIMIT 50
      `).all(userId, `%${q}%`, `%${q}%`);

      res.json(sessions);
    } catch (error) {
      console.error('Search sessions error:', error);
      res.status(500).json({ error: 'Failed to search sessions' });
    }
  }
};
