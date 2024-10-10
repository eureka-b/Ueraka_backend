const axios = require('axios');
const db = require('../config/db'); // MySQL DB 설정

// API에서 주식 시세 가져오기
const fetchStockPricesFromAPI = async () => {
    try {
        const response = await axios.get('https://api.stockinfo.com/stocks', {
            params: {
                // 필요한 요청 파라미터 추가
                serviceKey: process.env.API_KEY,  // 환경변수에 저장된 API 키 사용
                stockId: stdckId,
                date: date,
                
            }
        });

        return response.data;  // API 응답 데이터 반환
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw error;
    }
};

// API에서 가져온 주식 시세를 MySQL에 저장
const saveStockPricesToDB = async (stockData) => {
    try {
        const query = 'INSERT INTO stock_prices (company_name, stock_price, updated_at) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE stock_price = VALUES(stock_price), updated_at = NOW()';
        stockData.forEach(stock => {
            db.query(query, [stock.company_name, stock.stock_price], (err, result) => {
                if (err) {
                    console.error('DB 저장 오류:', err);
                }
            });
        });
    } catch (error) {
        console.error('DB 저장 중 오류:', error);
        throw error;
    }
};

// API 호출 후 데이터 가져와 MySQL에 저장하는 API 엔드포인트
const updateStockPrices = async (req, res) => {
    try {
        const stockData = await fetchStockPricesFromAPI();  // API에서 데이터 가져옴
        await saveStockPricesToDB(stockData);  // DB에 데이터 저장
        return res.json({ message: '주식 시세 업데이트 완료' });
    } catch (error) {
        return res.status(500).json({ error: '주식 시세 업데이트 실패' });
    }
};

// 주식 정보를 반환하는 API 엔드포인트
const getStockPrices = async (req, res) => {
    try {
        const query = 'SELECT * FROM stock_prices ORDER BY updated_at DESC';
        db.query(query, (err, results) => {
            if (err) {
                console.error('DB 조회 오류:', err);
                return res.status(500).json({ error: '주식 정보 조회 실패' });
            }
            return res.json(results);
        });
    } catch (error) {
        console.error('오류:', error);
        return res.status(500).json({ error: '주식 정보 조회 실패' });
    }
};

// 모듈 내보내기
module.exports = {
    updateStockPrices,
    getStockPrices
};
