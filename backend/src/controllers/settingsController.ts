import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import db from '../db/database.js';
import type { UserSettings, ApiKey } from '../types';

export const settingsController = {
  async getSettings(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      let settings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(userId) as UserSettings | undefined;

      if (!settings) {
        const id = uuidv4();
        db.prepare('INSERT INTO user_settings (id, user_id) VALUES (?, ?)').run(id, userId);
        settings = db.prepare('SELECT * FROM user_settings WHERE id = ?').get(id) as UserSettings;
      }

      res.json(settings);
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({ error: 'Failed to get settings' });
    }
  },

  async updateSettings(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { theme, accent_color, font_size, stream_responses, save_conversations, reduce_motion, high_contrast, paper_texture } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      let settings = db.prepare('SELECT id FROM user_settings WHERE user_id = ?').get(userId) as { id: string } | undefined;

      if (!settings) {
        const id = uuidv4();
        db.prepare('INSERT INTO user_settings (id, user_id) VALUES (?, ?)').run(id, userId);
        settings = { id };
      }

      db.prepare(`
        UPDATE user_settings 
        SET theme = COALESCE(?, theme),
            accent_color = COALESCE(?, accent_color),
            font_size = COALESCE(?, font_size),
            stream_responses = COALESCE(?, stream_responses),
            save_conversations = COALESCE(?, save_conversations),
            reduce_motion = COALESCE(?, reduce_motion),
            high_contrast = COALESCE(?, high_contrast),
            paper_texture = COALESCE(?, paper_texture),
            updated_at = datetime('now')
        WHERE user_id = ?
      `).run(theme, accent_color, font_size, stream_responses, save_conversations, reduce_motion, high_contrast, paper_texture, userId);

      const updatedSettings = db.prepare('SELECT * FROM user_settings WHERE user_id = ?').get(userId);

      res.json(updatedSettings);
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  },

  async getApiKeys(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const keys = db.prepare('SELECT id, user_id, name, last_used_at, created_at FROM api_keys WHERE user_id = ?').all(userId);

      res.json(keys);
    } catch (error) {
      console.error('Get API keys error:', error);
      res.status(500).json({ error: 'Failed to get API keys' });
    }
  },

  async createApiKey(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { name } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const id = uuidv4();
      const rawKey = `sk_${crypto.randomBytes(32).toString('hex')}`;
      const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

      db.prepare(`
        INSERT INTO api_keys (id, user_id, name, key_hash)
        VALUES (?, ?, ?, ?)
      `).run(id, userId, name, keyHash);

      res.status(201).json({
        id,
        user_id: userId,
        name,
        key: rawKey,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Create API key error:', error);
      res.status(500).json({ error: 'Failed to create API key' });
    }
  },

  async deleteApiKey(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const result = db.prepare('DELETE FROM api_keys WHERE id = ? AND user_id = ?').run(id, userId);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'API key not found' });
      }

      res.json({ message: 'API key deleted successfully' });
    } catch (error) {
      console.error('Delete API key error:', error);
      res.status(500).json({ error: 'Failed to delete API key' });
    }
  }
};
