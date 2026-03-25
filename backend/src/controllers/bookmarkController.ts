import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';

export const bookmarkController = {
  async getBookmarks(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { type } = req.query;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      let query = 'SELECT * FROM bookmarks WHERE user_id = ?';
      const params: any[] = [userId];

      if (type && typeof type === 'string') {
        query += ' AND type = ?';
        params.push(type);
      }

      query += ' ORDER BY created_at DESC';

      const bookmarks = db.prepare(query).all(...params);

      res.json(bookmarks);
    } catch (error) {
      console.error('Get bookmarks error:', error);
      res.status(500).json({ error: 'Failed to get bookmarks' });
    }
  },

  async createBookmark(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { title, content, type, reference_id } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      if (!title || !type) {
        return res.status(400).json({ error: 'Title and type are required' });
      }

      const id = uuidv4();

      db.prepare(`
        INSERT INTO bookmarks (id, user_id, title, content, type, reference_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, userId, title, content || null, type, reference_id || null);

      const bookmark = db.prepare('SELECT * FROM bookmarks WHERE id = ?').get(id);

      res.status(201).json(bookmark);
    } catch (error) {
      console.error('Create bookmark error:', error);
      res.status(500).json({ error: 'Failed to create bookmark' });
    }
  },

  async deleteBookmark(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const result = db.prepare('DELETE FROM bookmarks WHERE id = ? AND user_id = ?').run(id, userId);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Bookmark not found' });
      }

      res.json({ message: 'Bookmark deleted successfully' });
    } catch (error) {
      console.error('Delete bookmark error:', error);
      res.status(500).json({ error: 'Failed to delete bookmark' });
    }
  }
};
