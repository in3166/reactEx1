import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from './types';

export function loginUser(dataTosubmit) {
    const request = axios.post('/api/users/login', dataTosubmit)
        .then(response => response.data) //back에서 받아온 모든 데이터
    // reducer로 넘겨줘야함
    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser(dataTosubmit) {

    const request = axios.post('/api/users/register', dataTosubmit)
        .then(response => response.data) //back에서 받아온 모든 데이터

    // reducer로 넘겨줘야함
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function auth() {

    const request = axios.get('/api/users/auth')
        .then(response => response.data) //back에서 받아온 모든 데이터

    // reducer로 넘겨줘야함
    return {
        type: AUTH_USER,
        payload: request
    }
}