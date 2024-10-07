const cron = require('node-cron');
const { updateStockPrices } = require('../controllers/stockController');

// 매일 9시마다 주식 시세를 업데이트
cron.schedule('0 9 * * *', async () => {
    console.log('주식 시세를 업데이트합니다.');
    await updateStockPrices();
});