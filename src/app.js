const express = require('express');
const cors = require('cors');
const app = express();
const stockRoutes = require('./routes/stockRoutes');
require('dotenv').config();  // .env 파일 로드
require('./config/scheduler'); // 주기적인 작업 스케줄러 추가

// 미들웨어 설정
app.use(express.json());
app.use(cors());

// API 라우트 설정
app.use('/api', stockRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});