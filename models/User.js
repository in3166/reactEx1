const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 스페이스 제거
        unique: 1
    },
    password: {
        type: String,
        maxlength: 10
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0 //일반 유저
    },
    image: String,
    token: { // 유효성 관리
        type: String
    },
    tokenExp: { // 유효기간
        type: Number
    }
})

// 모델은 스키마를 감싼다.  모델의 이름, 스키마
const User = mongoose.model('User', userSchema);

// 모델을 다른 파일에서도 사용
module.exports = { User }