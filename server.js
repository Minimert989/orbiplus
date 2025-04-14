const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

app.use(express.json());
app.use(express.static('public'));
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
