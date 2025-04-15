const express = require('express');
const app = express();

// ✅ 모든 라우트 가져오기
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');   // ← 추가
const likeRoutes = require('./routes/likes');         // ← 추가

app.use(express.json());
app.use(express.static('public'));

// ✅ 실제 경로 연결
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);   // ← 추가
app.use('/likes', likeRoutes);         // ← 추가

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
