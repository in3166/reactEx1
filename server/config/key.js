// 개발 환경 2가지
//     (환경 변수 process.env.NODE_ENV)
//    Local         /   Deploy(배포) 이후  
//   [development]      [production]: 배포 사이트 자체에서 변수를 설정하고 거기서 가져와야함 (EX. Heroku - configVars)

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}