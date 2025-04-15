const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

// 댓글 작성
router.post('/create', (req, res) => {
  const { post_id, user_id, content } = req.body;

  // ✅ 입력값 검사
  if (!post_id || !user_id || !content?.trim()) {
    return res.status(400).json({ error: 'post_id, user_id, content are required' });
  }

  // ✅ created_at 포함
  db.run(
    "INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, datetime('now'))",
    [post_id, user_id, content.trim()],
    function (err) {
      if (err) {
        console.error('[댓글 작성 에러]', err.message);
        return res.status(500).json({ error: 'Failed to post comment', detail: err.message });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

// 댓글 목록 조회
router.get('/:post_id', (req, res) => {
  const { post_id } = req.params;

  db.all(
    `SELECT c.id, c.content, c.created_at, u.username
     FROM comments c
     JOIN users u ON c.user_id = u.id
     WHERE post_id = ?
     ORDER BY c.created_at ASC`,
    [post_id],
    (err, rows) => {
      if (err) {
        console.error('[댓글 불러오기 에러]', err.message);
        return res.status(500).json({ error: 'Failed to load comments' });
      }
      res.json(rows);
    }
  );
});

// 댓글 삭제
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM comments WHERE id = ?", [id], function (err) {
    if (err) {
      console.error('[댓글 삭제 에러]', err.message);
      return res.status(500).json({ error: 'Failed to delete comment' });
    }
    res.json({ success: true });
  });
});

module.exports = router;

// GET /comments/user/:user_id → 특정 사용자의 댓글 목록
router.get('/user/:user_id', (req, res) => {
  const { user_id } = req.params;
  db.all(
    `SELECT c.id, c.content, c.created_at, p.title AS post_title
     FROM comments c
     JOIN posts p ON c.post_id = p.id
     WHERE c.user_id = ?
     ORDER BY c.created_at DESC`,
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch user comments' });
      res.json(rows);
    }
  );
});
