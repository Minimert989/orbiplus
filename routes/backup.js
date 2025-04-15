// routes/backup.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET = 'supersecret';  // 너의 auth.js에서 사용하는 SECRET과 동일해야 함

// DB 파일 경로
const dbPath = path.join(__dirname, '../db/database.sqlite');

// 관리자 인증 미들웨어
function isAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err || !user?.is_admin) return res.status(403).json({ error: 'Admin only' });
    req.user = user;
    next();
  });
}

// 백업 다운로드 라우트
router.get('/', isAdmin, (req, res) => {
  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({ error: 'Database file not found' });
  }
  res.download(dbPath, 'database.sqlite');
});

module.exports = router;
