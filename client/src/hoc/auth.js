import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_action/user_action';

// HOC (higher-order component) 컴포넌트
// 페이지 이동 시 마다 서버에 사용자 정보를 받아온다.
// null: 아무나 출입 가능, true: 로그인 유저만 가능, false: 로그인 안한 유저만 가능 
export default function (SpecifiComponent, option, adminRoute = null) {
    function AuthenticationCheck(props) {
        const dispatch = useDispatch(); // redux hook

        useEffect(() => {
            //axios.get('/api/users/auth') 대신 redux 사용
            // 서버 middleware/auth.js에서 토큰을 이용해 권한 확인
            dispatch(auth()).then(response => {
                console.log(response)

                // 분기 처리
                // 로그인 하지 않은 상태
                if (!response.payload.isAuth) {
                    if (option) { //로그인이 요구되는 페이지에 로그인하지 않은 상태로 접근 한다면
                        props.history.push('/login');
                    }
                } else {
                    // 로그인한 상태
                    if (adminRoute && !response.payload.isAdmin) { // 관리자가 아닌데 관리자 페이지 접근
                        props.history.push('/');
                    } else {
                        if (!option) { // 로그인한 유저가 로그인유저 접근 금지 페이지 접근
                            props.history.push('/');
                        }
                    }
                }
            })
        }, [])
        return (
            <SpecifiComponent />
        )
    }




    return AuthenticationCheck
}