const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser') // 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해줌
const cookieParser = require('cookie-parser') // 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해줌
const { User } = require('./models/User')
const { auth } = require('./middleware/auth')
// cd Users/yu/Desktop/study/react/inflearn/reactandexpress

const config = require('./config/key')

app.use(bodyParser.urlencoded({ extended: true }));  // application/x-www-form-urlencoded 데이터를 분석해서 가져옴
app.use(bodyParser.json()); // application/json 데이터를 분석해서 가져옴
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDb Connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send('hi'))

app.post('/api/users/register', (req, res) => {
    // 회원가입 필요 정보 Client에서 가져오면 데이터베이스에 넣기
    const user = new User(req.body) // req.body에 {id:'123}등 정보 있는데 bodyParser가 해줌

    user.save((err, userInfo) => { // 몽고db 메서드, 정보들이 user 모델에 저장됨
        if (err) { console.log(err); return res.json({ success: false, err }) } // 실패시 사용자에게 에러 전달
        return res.status(200).json({
            success: true
        })
    });
})

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일 DB에서 찾기

    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일 해당 유저가 없습니다."
            })
        }

        // 비밀번호와 같은지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다.' })

            // npm install jsonwebtoken --save, npmjs.com: 사이트 참조하여 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 토큰을 쿠키, 로컬스토리지 등에 저장 (쿠키로)
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
                console.log(user)
            })
        })
    })
    // Token 생성
})


// auth 미들웨어, url로 요청을 받고 콜백을 실행하기 전에 처리
app.post('/api/users/auth', auth, (req, res) => {
    // auth: true
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate(
        { _id: req.user._id },
        { token: "" },
        (err, user) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
        })
})

app.listen(port, () => console.log(`Listening ${port}!`))