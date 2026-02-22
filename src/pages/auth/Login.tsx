import { useState, type FormEvent } from "react";
import type { LoginRequest } from "../../types/request/loginRequest";
import { login as loginApi } from "../../api/authApi"; 
import { myPage } from "../../api/userApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import logo from "../../assets/logo.png";

function Login() {
    const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    // AuthContext에서 전역 로그인 함수를 가져옴
    const { login } = useAuth(); 

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        const loginData: LoginRequest = {
            ID: username,
            PW: password
        }; 

        try {
            const response = await loginApi(loginData);
            
            if (response.resultCode === "SUCCESS") {
                const userResponse = await myPage();
                
                const role = userResponse.data.role;
                login(role); 

                alert("로그인 성공");
                
                navigate('/');
            }
        } catch (error) {
            alert("아이디 또는 비밀번호를 확인해주세요.");
            console.error("로그인 에러:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 min-h-[80vh]">
            {/* 로고 영역 */}
            <div className="mb-8">
                <Link to="/">
                    <img src={logo} alt="Gutjjeu Logo" className="w-40 h-auto object-contain" />
                </Link>
            </div>

            {/* 로그인 카드 */}
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">로그인</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="아이디를 입력하세요"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors mt-2 shadow-sm"
                    >
                        로그인
                    </button>

                    <div className="text-center mt-4 text-sm text-gray-500">
                        계정이 없으신가요?{" "}
                        <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                            회원가입
                        </Link>
                    </div>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500 font-medium">소셜 로그인</span>
                    </div>
                </div>

                {/* 소셜 로그인 버튼 리스트 */}
                <div className="space-y-3">
                    <a
                        href={`${BACKEND_URL}/oauth2/authorization/naver`}
                        className="flex items-center justify-center w-full py-2.5 bg-[#03C75A] text-white rounded-md font-medium hover:opacity-90 transition-opacity shadow-sm"
                    >
                        네이버로 시작하기
                    </a>
                    <a
                        href={`${BACKEND_URL}/oauth2/authorization/kakao`}
                        className="flex items-center justify-center w-full py-2.5 bg-[#FEE500] text-[#191919] rounded-md font-medium hover:opacity-90 transition-opacity shadow-sm"
                    >
                        카카오로 시작하기
                    </a>
                    <a
                        href={`${BACKEND_URL}/oauth2/authorization/google`}
                        className="flex items-center justify-center w-full py-2.5 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Google로 시작하기
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Login;