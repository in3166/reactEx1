import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_action/user_action';
import { withRouter } from 'react-router-dom';

function LoginPage(props) {
    const dispatch = useDispatch();

    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value)
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault(); // 없으면 밑에 코드가 실행되지 않고 refresh가 됨

        // 받은 정보 axios로 서버에 보내기
        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    props.history.push('/')
                } else {
                    alert('error');
                }
            })

        // 원래 여기서 했던 request를 redux를 사용하므로 action 폴더로 이동
        // Axios.post('/api/user/login', body)
        //     .then(response)

    }
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }} >
            <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler}></input>
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler}></input>
                <br />
                <button type='submit'>
                    Login
                </button>
            </form>
        </ div>
    )
}

export default withRouter(LoginPage)