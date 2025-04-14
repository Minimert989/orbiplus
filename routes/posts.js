const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

router.post('/create', (req, res) => {
  const { user_id, title, content, category } = req.body;
  db.run("INSERT INTO posts (user_id, title, content, category) VALUES (?, ?, ?, ?)",
    [user_id, title, content, category], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to create post' });
      res.json({ success: true, id: this.lastID });
    });
});

router.get('/list', (req, res) => {
  const { category } = req.query;
  db.all("SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC", [category], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch posts' });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'Post not found' });
    res.json(row);
  });
});

module.exports = router;
