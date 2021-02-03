import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_action/types';

export default function (state = {}, action) {
    // action에 너무 다양한 type들이 나중에 생기므로 switch 사용
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload } // ...state 빈상태를 똑같이 가져옴을 의미, action.payload-백에서 보낸 정보 저장
            break;
        case REGISTER_USER:
            return { ...state, register: action.payload }
            break;
        case AUTH_USER:
            return { ...state, userData: action.payload } // 서버 auth 처리 완료 후 user에 대한 모든 정보 클라이언트에 반환
            break;
        default:
            return state;

    }
}