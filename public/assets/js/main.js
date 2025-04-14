fetch('/posts/list?category=column')
  .then(res => res.json())
  .then(posts => {
    const list = document.getElementById('recent-posts');
    posts.forEach(p => {
      const item = document.createElement('li');
      item.innerHTML = `<a href="/view.html?id=${p.id}">[칼럼] ${p.title}</a>`;
      list.appendChild(item);
    });
  });
