const express = require('express');
const app = express();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const adminRoutes = require('./routes/admin');  // ✅ 추가


app.use(express.json());
app.use(express.static('public'));

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/likes', likeRoutes);
app.use('/admin', adminRoutes);                 // ✅ 추가

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
