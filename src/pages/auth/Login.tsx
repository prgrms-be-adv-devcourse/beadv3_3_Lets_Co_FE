import { useState, type FormEvent } from "react";
import type { LoginRequest } from "../../types/request/loginRequest";
import { login } from "../../api/authApi";
import { Link, useNavigate } from "react-router-dom";

function Login() {

    // todo. 추후 환경 변수로 관리
    const BACKEND_URL = "http://localhost:8000";


    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');    

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {

        e.preventDefault();
        
        const loginData: LoginRequest = {
            ID: username,
            PW: password
        };

        try {
            await login(loginData);

            alert("로그인 성공")
            navigate('/');

        } catch (error) {
            alert("알 수 없는 오류가 발생했습니다.");
            console.error("예상치 못한 에러:", error);
        }
        
    }

    return (
        <div>
            <h1>로그인</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID: </label>
                    <input     
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="아이디"
                    />
                </div>

                <div>
                    <label>PW: </label>
                    <input     
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="패스워드"
                    />
                </div>

                <button type="submit">로그인</button>
                <Link to={"/signup"}>회원가입</Link>
            </form>
            <hr/>

            <div>
                <a href={`${BACKEND_URL}/oauth2/authorization/naver`}>네이버 로그인</a>
            </div>
            <div>
                <a href={`${BACKEND_URL}/oauth2/authorization/google`}>구글 로그인</a>
            </div>
            <div>
                <a href={`${BACKEND_URL}/oauth2/authorization/kakao`}>카카오 로그인</a>
            </div>
        </div>
    );
};


export default Login;