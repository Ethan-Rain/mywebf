const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // 允许的前端地址
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Image-ID'] // 允许前端访问的自定义响应头
}));

app.listen(58080, () => {
  console.log('Server is running on port 58080');
});
