// routes/restore.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET = 'supersecret';
const upload = multer({ dest: 'uploads/' });
const dbPath = path.join(__dirname, '../db/database.sqlite');

function isAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err || !user?.is_admin) return res.status(403).json({ error: 'Admin only' });
    req.user = user;
    next();
  });
}

router.post('/', isAdmin, upload.single('file'), (req, res) => {
  const uploaded = req.file.path;

  // DB 덮어쓰기
  fs.copyFile(uploaded, dbPath, err => {
    fs.unlinkSync(uploaded); // 업로드 임시 파일 제거
    if (err) return res.status(500).json({ error: 'Failed to restore DB' });
    return res.json({ success: true, message: 'DB restored successfully' });
  });
});

module.exports = router;
