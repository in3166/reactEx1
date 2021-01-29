const { User } = require('../models/User')

let auth = (req, res, next) => {
    // 인증 처리 부분
    // 1. 클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    // 2. 토큰을 복호화하여 서버 디비에서 비교하여 유저를 찾음 (user 모델에서 메서드 생성)
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true })
        req.token = token; // index 콜백에서 정보를 사용할 수 있게 넣어줌
        req.user = user;
        next(); // index의 콜백으로 
    })

    // 3. 유저가 있으면 인증 ok / 없으면 x

}

module.exports = { auth };