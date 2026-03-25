import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';

export const analyticsController = {
  async getStats(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const totalConversations = db.prepare(`
        SELECT COUNT(*) as count FROM chat_sessions WHERE user_id = ?
      `).get(userId) as { count: number };

      const totalMessages = db.prepare(`
        SELECT COALESCE(SUM(tokens_used), 0) as total FROM messages m
        JOIN chat_sessions cs ON m.session_id = cs.id
        WHERE cs.user_id = ?
      `).get(userId) as { total: number };

      const totalDocuments = db.prepare(`
        SELECT COUNT(*) as count FROM documents WHERE user_id = ?
      `).get(userId) as { count: number };

      const today = new Date().toISOString().split('T')[0];
      const todayConversations = db.prepare(`
        SELECT COUNT(*) as count FROM chat_sessions 
        WHERE user_id = ? AND date(created_at) = date('now')
      `).get(userId) as { count: number };

      const weeklyData = db.prepare(`
        SELECT 
          date(created_at) as date,
          COUNT(*) as conversations
        FROM chat_sessions
        WHERE user_id = ? AND created_at >= datetime('now', '-7 days')
        GROUP BY date(created_at)
        ORDER BY date ASC
      `).all(userId);

      res.json({
        conversations: totalConversations.count,
        tokensUsed: totalMessages.total,
        documents: totalDocuments.count,
        todayConversations: todayConversations.count,
        weeklyData,
        accuracy: 97.8
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to get stats' });
    }
  },

  async recordUsage(req: Request, res: Response) {
    try {
      const authReq = req as any;
      const userId = authReq.user?.id;
      const { tokens_used, type } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const today = new Date().toISOString().split('T')[0];
      
      let analytics = db.prepare(`
        SELECT * FROM analytics WHERE user_id = ? AND period = ?
      `).get(userId, today) as any;

      if (!analytics) {
        const id = uuidv4();
        db.prepare(`
          INSERT INTO analytics (id, user_id, tokens_used, conversations_count, documents_count, period)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(id, userId, tokens_used || 0, type === 'conversation' ? 1 : 0, type === 'document' ? 1 : 0, today);
      } else {
        db.prepare(`
          UPDATE analytics 
          SET tokens_used = tokens_used + ?,
              conversations_count = conversations_count + ?,
              documents_count = documents_count + ?
          WHERE user_id = ? AND period = ?
        `).run(
          tokens_used || 0,
          type === 'conversation' ? 1 : 0,
          type === 'document' ? 1 : 0,
          userId,
          today
        );
      }

      res.json({ message: 'Usage recorded' });
    } catch (error) {
      console.error('Record usage error:', error);
      res.status(500).json({ error: 'Failed to record usage' });
    }
  }
};
