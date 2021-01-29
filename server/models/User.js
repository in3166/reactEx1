const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

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
        maxlength: 200
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

userSchema.pre('save', function (next) { // 화살표 함수로 해주면 this 바인딩이 안되고 상위 scope를 this로 지정해주니까
    var user = this; // 위에 user스키마 가리킴
    // 비밀번호 암호화  npm intall bcrypt

    if (user.isModified('password')) { // 모델의 비밀번호가 변경될 때만

        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
    // 기능이 다 끝나면 index의 save로 넘어감
}); // 유저 모델이 정보 저장하기 전에 기능 수행

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // plainPassword: 사용자가 입력한 비암호화 비밀번호
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function (cb) {

    var user = this;
    // jsonwebtoken 이용하여 토큰 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken = token, token을 사용해서 누군지 판단
    user.token = token; //user DB에 토큰 저장
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    })
}

// 스태틱은 객체의 인스턴스를 만들지 않아도 사용이 가능
userSchema.statics.findByToken = function (token, cb) {
    var user = this;
    // 토큰을 decode
    jwt.verify(token, 'secretToken', function (err, decoded) {
        // 유저 아이디로 유저를 찾고 클라이언트에서 가져온 토큰과 DB 토큰 비교
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        });
    });
}

// 모델은 스키마를 감싼다.  모델의 이름, 스키마
const User = mongoose.model('User', userSchema);

// 모델을 다른 파일에서도 사용
module.exports = { User }