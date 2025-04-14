const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

router.post('/toggle', (req, res) => {
  const { post_id, user_id } = req.body;
  db.get("SELECT * FROM likes WHERE post_id = ? AND user_id = ?", [post_id, user_id], (err, row) => {
    if (row) {
      db.run("DELETE FROM likes WHERE post_id = ? AND user_id = ?", [post_id, user_id]);
      res.json({ liked: false });
    } else {
      db.run("INSERT INTO likes (post_id, user_id) VALUES (?, ?)", [post_id, user_id]);
      res.json({ liked: true });
    }
  });
});

router.get('/count/:post_id', (req, res) => {
  db.get("SELECT COUNT(*) as count FROM likes WHERE post_id = ?", [req.params.post_id], (err, row) => {
    res.json({ count: row.count });
  });
});

module.exports = router;
