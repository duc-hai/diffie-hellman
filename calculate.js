const express = require('express')
const router = express.Router()
const dhke = require('./algorithms/dhke')

//File giao diện khi vào trang dhke
router.get('/dhke', (req, res) => {
    return res.render('dhke', {layout: false})
})

//Bắt đường dẫn và xử lý dữ liệu khi bấm nút: Trao đổi. 
router.post('/dhke', (req, res) => {
    try {
        //Gọi đến hàm calculateDH và trả về chuỗi JSON (xử lý theo kiểu API)
        const result = dhke.calculateDiffieHellman(req.body.prime, req.body.primitive, req.body.key1, req.body.key2)
        return res.status(200).json(result)
    }
    catch (err) {
        //Bắt các lỗi nếu có
        console.log(err.message)
        return res.status(500).json(err.message)
    }
})

router.post('/generatePri', (req, res) => {
    try {
        //Bắt đường dẫn và gọi đến hàm generate số nguyên tố, truyền vào 1 độ dài bit lấy từ body của method POST
        let primeNumber = dhke.generatePrime(parseInt(req.body.bit))

        //Tương tự
        let primitiveNumber = dhke.generatePrimitive(primeNumber)
        return res.status(200).json({primeNumber, primitiveNumber})
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).json({error: err.message})
    }
})

//Trả về private key sau khi generate
router.get('/generateKey', (req, res) => {
    try {
        return res.status(200).json({key: dhke.generateSecretKey(30)})
    }
    catch (err) {
        return res.status(500).json({error: err.message})
    }
})

//Đối với các đường dẫn không hợp lệ, trả về lỗi 404 Not Found để tránh bị treo website
router.use('/', (req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>')
})

module.exports = router;
