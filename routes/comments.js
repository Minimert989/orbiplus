const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

router.post('/create', (req, res) => {
  const { post_id, user_id, content } = req.body;
  db.run(
    "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
    [post_id, user_id, content],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to post comment' });
      res.json({ success: true, id: this.lastID });
    }
  );
});

router.get('/:post_id', (req, res) => {
  const { post_id } = req.params;
  db.all(
    "SELECT c.id, c.content, c.created_at, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE post_id = ? ORDER BY c.created_at ASC",
    [post_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to load comments' });
      res.json(rows);
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM comments WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to delete comment' });
    res.json({ success: true });
  });
});

module.exports = router;
