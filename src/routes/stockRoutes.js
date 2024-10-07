const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// 주식 시세 업데이트 엔드포인트
router.get('/stocks/update', stockController.updateStockPrices);

module.exports = router;