const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

// Simple check - in real apps, use JWT + is_admin flag
const ADMIN_USER_ID = 1;

router.get('/posts', (req, res) => {
  db.all("SELECT p.id, p.title, p.category, u.username FROM posts p JOIN users u ON p.user_id = u.id", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch posts' });
    res.json(rows);
  });
});

router.delete('/post/:id', (req, res) => {
  db.run("DELETE FROM posts WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete post' });
    res.json({ success: true });
  });
});

router.get('/comments', (req, res) => {
  db.all("SELECT c.id, c.content, c.post_id, u.username FROM comments c JOIN users u ON c.user_id = u.id", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch comments' });
    res.json(rows);
  });
});

router.delete('/comment/:id', (req, res) => {
  db.run("DELETE FROM comments WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete comment' });
    res.json({ success: true });
  });
});

router.get('/users', (req, res) => {
  db.all("SELECT id, username, created_at FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch users' });
    res.json(rows);
  });
});

module.exports = router;
