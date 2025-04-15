const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.sqlite');

// 좋아요 토글 API
router.post('/toggle', (req, res) => {
  const { post_id, user_id } = req.body;

  if (!post_id || !user_id) {
    return res.status(400).json({ error: 'post_id, user_id required' });
  }

  // 최종 응답 함수: liked 상태와 좋아요 수 반환
  const updateCountAndRespond = (liked) => {
    db.get(
      "SELECT COUNT(*) as count FROM likes WHERE post_id = ?",
      [post_id],
      (err, row) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch like count' });
        res.json({ liked, count: row.count });
      }
    );
  };

  // 먼저 유저가 이미 좋아요 했는지 확인
  db.get(
    "SELECT * FROM likes WHERE post_id = ? AND user_id = ?",
    [post_id, user_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'DB lookup error' });

      if (row) {
        // 좋아요 되어 있으면 삭제
        db.run(
          "DELETE FROM likes WHERE post_id = ? AND user_id = ?",
          [post_id, user_id],
          function (err) {
            if (err) return res.status(500).json({ error: 'Failed to remove like' });
            updateCountAndRespond(false);
          }
        );
      } else {
        // 좋아요 안 되어 있으면 추가
        db.run(
          "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
          [post_id, user_id],
          function (err) {
            if (err) return res.status(500).json({ error: 'Failed to add like' });
            updateCountAndRespond(true);
          }
        );
      }
    }
  );
});

// 좋아요 개수만 조회 API
router.get('/count/:post_id', (req, res) => {
  db.get(
    "SELECT COUNT(*) as count FROM likes WHERE post_id = ?",
    [req.params.post_id],
    (err, row) => {
      if (err) return res.status(500).json({ count: 0, error: 'DB error' });
      res.json({ count: row.count });
    }
  );
});

module.exports = router;
