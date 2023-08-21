const express = require('express') //Khai báo framework
const path = require('path')
const handlebars = require('express-handlebars') //Khai báo view engine
const app = express() //Khởi tạo đối tượng của express
const calculate = require('./calculate')

app.use(express.static(path.join(__dirname, 'public'))) //Set đường dẫn để sử dụng các mục trong file public
app.use(express.json()) // Cho phép sử dụng các định dạng json
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('home', {layout: false}) //Set giao diện đầu tiên khi vào trang chủ
})

app.use('/', calculate) //Link đến file calculate và sử dụng

app.engine('hbs',
    handlebars.engine({
        extname: 'hbs', //Set extenstion name is hbs
        defaultLayout: 'main',
    })
)

app.set('view engine', 'hbs') //Set view engine là handlebars
app.set('views', path.join(__dirname, 'views')) //Set đường dẫn đến thư mục của view engine

// Cấu hình đường dẫn (PORT và HOST) để chạy chương trình
const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 3000

//Bắt đầu project
app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`)
})