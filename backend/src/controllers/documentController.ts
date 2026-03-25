import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import db from '../db/database.js';
import type { Document } from '../types';

const UPLOAD_DIR = './uploads';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const documentController = {
  async getDocuments(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const documents = db.prepare(`
        SELECT * FROM documents 
        WHERE user_id = ?
        ORDER BY updated_at DESC
      `).all(userId);

      res.json(documents);
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({ error: 'Failed to get documents' });
    }
  },

  async getDocument(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const document = db.prepare(`
        SELECT * FROM documents 
        WHERE id = ? AND user_id = ?
      `).get(id, userId) as Document | undefined;

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.json(document);
    } catch (error) {
      console.error('Get document error:', error);
      res.status(500).json({ error: 'Failed to get document' });
    }
  },

  async createDocument(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { name, type, size, content } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      if (!name || !type || !size) {
        return res.status(400).json({ error: 'Name, type, and size are required' });
      }

      const id = uuidv4();
      const fileName = `${id}-${name}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      if (content) {
        fs.writeFileSync(filePath, content);
      } else {
        fs.writeFileSync(filePath, '');
      }

      db.prepare(`
        INSERT INTO documents (id, user_id, name, type, size, path)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, userId, name, type, size, filePath);

      const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(id);

      res.status(201).json(document);
    } catch (error) {
      console.error('Create document error:', error);
      res.status(500).json({ error: 'Failed to create document' });
    }
  },

  async updateDocument(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { id } = req.params;
      const { name, content, starred } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const existing = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(id, userId) as Document | undefined;
      if (!existing) {
        return res.status(404).json({ error: 'Document not found' });
      }

      if (content !== undefined) {
        fs.writeFileSync(existing.path, content);
      }

      db.prepare(`
        UPDATE documents 
        SET name = COALESCE(?, name),
            starred = COALESCE(?, starred),
            updated_at = datetime('now')
        WHERE id = ? AND user_id = ?
      `).run(name, starred, id, userId);

      const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(id);

      res.json(document);
    } catch (error) {
      console.error('Update document error:', error);
      res.status(500).json({ error: 'Failed to update document' });
    }
  },

  async deleteDocument(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const document = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(id, userId) as Document | undefined;
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      if (fs.existsSync(document.path)) {
        fs.unlinkSync(document.path);
      }

      db.prepare('DELETE FROM documents WHERE id = ? AND user_id = ?').run(id, userId);

      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Delete document error:', error);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  },

  async downloadDocument(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const document = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(id, userId) as Document | undefined;
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      if (!fs.existsSync(document.path)) {
        return res.status(404).json({ error: 'File not found on disk' });
      }

      res.download(document.path, document.name);
    } catch (error) {
      console.error('Download document error:', error);
      res.status(500).json({ error: 'Failed to download document' });
    }
  },

  async searchDocuments(req: Request, res: Response) {
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

      const documents = db.prepare(`
        SELECT * FROM documents 
        WHERE user_id = ? AND name LIKE ?
        ORDER BY updated_at DESC
        LIMIT 50
      `).all(userId, `%${q}%`);

      res.json(documents);
    } catch (error) {
      console.error('Search documents error:', error);
      res.status(500).json({ error: 'Failed to search documents' });
    }
  }
};
