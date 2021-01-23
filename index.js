const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser') // 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해줌
const { User } = require('./models/User')

const config = require('./config/key')

app.use(bodyParser.urlencoded({ extended: true }));  // application/x-www-form-urlencoded 데이터를 분석해서 가져옴
app.use(bodyParser.json()); // application/json 데이터를 분석해서 가져옴

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDb Connected...'))
    .catch(err => console.log(err))



app.get('/', (req, res) => res.send('hi'))

app.post('/register', (req, res) => {
    // 회원가입 필요 정보 Client에서 가져오면 데이터베이스에 넣기

    const user = new User(req.body) // req.body에 {id:'123}등 정보 있는데 bodyParser가 해줌
    user.save((err, userInfo) => { // 몽고db 메서드, 정보들이 user 모델에 저장됨
        if (err) return res.json({ success: false, err }) // 실패시 사용자에게 에러 전달
        return res.status(200).json({
            success: true
        })
    });
})

app.listen(port, () => console.log(`Listening ${port}!`))