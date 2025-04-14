const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT id, username, created_at FROM users WHERE id = ?", [id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

router.get('/:id/posts', (req, res) => {
  db.all("SELECT id, title, category, created_at FROM posts WHERE user_id = ?", [req.params.id], (err, posts) => {
    if (err) return res.status(500).json({ error: 'Failed to load posts' });
    res.json(posts);
  });
});

router.get('/:id/comments', (req, res) => {
  db.all("SELECT c.content, c.created_at, p.title AS post_title FROM comments c JOIN posts p ON c.post_id = p.id WHERE c.user_id = ?", [req.params.id], (err, comments) => {
    if (err) return res.status(500).json({ error: 'Failed to load comments' });
    res.json(comments);
  });
});

module.exports = router;
