import express from "express";
import { posts } from "./posts.js";

const app = express();
const PORT = 3000;

// ✅ صفحة لكل منشور
app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);

  if (!post) {
    return res.status(404).send("Post not found");
  }

  // ✅ توليد HTML مع meta tags خاصة بالمنشور
  const html = `
    <!DOCTYPE html>
    <html lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>${post.title}</title>
      
      <!-- Open Graph -->
      <meta property="og:type" content="article">
      <meta property="og:title" content="${post.title}">
      <meta property="og:description" content="${post.content}">
      <meta property="og:image" content="${post.image}">
      <meta property="og:url" content="https://your-domain.com/posts/${post.id}">
      <meta property="og:site_name" content="CyberLearn">

      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${post.title}">
      <meta name="twitter:description" content="${post.content}">
      <meta name="twitter:image" content="${post.image}">
    </head>
    <body>
      <h1>${post.title}</h1>
      <p>${post.content}</p>
      <img src="${post.image}" alt="${post.title}">
    </body>
    </html>
  `;

  res.send(html);
});

// ✅ تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
