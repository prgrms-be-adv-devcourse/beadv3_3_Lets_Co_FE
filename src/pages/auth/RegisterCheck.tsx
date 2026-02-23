import { useState, type FormEvent } from "react";
import type { AuthenticationRequest } from "../../types/request/authenticationRequest";
import { checkCode } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import logo from "../../assets/logo.png";

function RegisterCheck() {
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); 

        const auth: AuthenticationRequest = {
            authCode: code
        };

        try {
            await checkCode(auth);
            alert("인증 성공! 로그인 페이지로 이동합니다.");
            navigate('/login');
        } catch (error) {
            if (error instanceof AxiosError ) {
                console.log("서버 에러 데이터:", error.response?.data);
            }
            alert("인증번호가 일치하지 않거나 만료되었습니다.");
            console.error("예상치 못한 에러:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50">
            {/* 로고 영역 */}
            <div className="mb-8 text-center">
                <Link to="/">
                    <img src={logo} alt="Gutjjeu Logo" className="w-36 h-auto mx-auto object-contain" />
                </Link>
            </div>

            {/* 인증 카드 */}
            <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">인증번호 확인</h1>
                    <p className="text-sm text-gray-500">
                        가입하신 이메일로 전송된 <br />
                        <strong>인증번호</strong>를 입력해주세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input 
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="인증번호 입력"
                            className="w-full text-center text-2xl tracking-widest font-bold px-4 py-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-base placeholder:font-normal placeholder:tracking-normal"
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        인증하기
                    </button>
                </form>

                <div className="mt-8 text-center space-y-3">
                    <p className="text-xs text-gray-400">
                        인증번호가 오지 않았나요? 스팸함 확인 또는 <br />
                        잠시 후 다시 시도해주세요.
                    </p>
                    <div className="pt-4 border-t border-gray-50">
                        <Link to="/login" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
                            로그인 화면으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCheck;