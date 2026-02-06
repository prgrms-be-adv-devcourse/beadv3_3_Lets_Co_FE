import { useState, type FormEvent } from "react";
import type { AuthenticationRequest } from "../../types/request/authenticationRequest";
import { checkCode } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export default function RegisterCheck() {

    const [code, setCode] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {

        e.preventDefault(); 

        const auth: AuthenticationRequest = {
            code: code
        };

        try {
            await checkCode(auth);
            alert("인증 성공! 로그인 페이지로 이동합니다.");
            navigate('/login');
        } catch (error) {
            if (error instanceof AxiosError ) {
                console.log("서버 에러 데이터:", error.response?.data);
                console.log("서버 에러 상태코드:", error.response?.status);
            }

            alert("알 수 없는 오류가 발생했습니다.");
            console.error("예상치 못한 에러:", error);
        }
    };

    return (
        <div>
            <h1>인증번호 확인</h1>

        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit">제출</button>
        </form>

        </div>
    );
};