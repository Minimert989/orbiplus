const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

// 관리자 인증 미들웨어 import
const jwt = require('jsonwebtoken');
const SECRET = 'supersecret';

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err || !user.is_admin) {
      return res.status(403).json({ error: '관리자 권한이 필요합니다.' });
    }
    req.user = user;
    next();
  });
}

// ✅ 전체 게시글 조회
router.get('/posts', authenticateAdmin, (req, res) => {
  db.all("SELECT * FROM posts ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// ✅ 전체 댓글 조회
router.get('/comments', authenticateAdmin, (req, res) => {
  db.all(`SELECT c.id, c.content, c.created_at, u.username, p.title AS post_title
          FROM comments c
          JOIN users u ON c.user_id = u.id
          JOIN posts p ON c.post_id = p.id
          ORDER BY c.created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// ✅ 전체 사용자 조회
router.get('/users', authenticateAdmin, (req, res) => {
  db.all("SELECT id, username, is_admin FROM users ORDER BY id ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// ✅ 게시글 삭제
router.delete('/posts/:id', authenticateAdmin, (req, res) => {
  const postId = req.params.id;
  db.run("DELETE FROM posts WHERE id = ?", [postId], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to delete post' });
    res.json({ success: true });
  });
});

// ✅ 댓글 삭제
router.delete('/comments/:id', authenticateAdmin, (req, res) => {
  const commentId = req.params.id;
  db.run("DELETE FROM comments WHERE id = ?", [commentId], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to delete comment' });
    res.json({ success: true });
  });
});

module.exports = router;
