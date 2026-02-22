import { useState, type FormEvent } from "react";
import type { AuthenticationRequest } from "../../types/request/authenticationRequest";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import { checkCode } from "../../api/sellerApi";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

function SellerCheck() {

    const [code, setCode] = useState('');
    const navigate = useNavigate();
    
    const { login } = useAuth(); 

    const handleSubmit = async (e: FormEvent) => {

        e.preventDefault(); 
        
        if (!code) {
            alert("인증번호를 입력해주세요.");
            return;
        }

        const auth: AuthenticationRequest = {
            authCode: code
        };

        try {
            await checkCode(auth);
            alert("인증 성공! 판매자 페이지로 이동합니다.");
            login("SELLER"); 
            navigate('/seller');
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
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 min-h-[80vh]">
            {/* 로고 영역 */}
            <div className="mb-8">
                <Link to="/">
                    <img src={logo} alt="Gutjjeu Logo" className="w-36 h-auto object-contain" />
                </Link>
            </div>

            {/* 인증번호 확인 카드 */}
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">인증번호 확인</h1>
                
                <p className="text-sm text-gray-600 text-center mb-6">
                    이메일로 발송된 판매자 인증번호를 입력해주세요.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">인증번호 *</label>
                        <input 
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="인증번호를 입력하세요"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors shadow-sm mt-4"
                    >
                        인증 확인
                    </button>
                </form>

            </div>
        </div>
    );
}

export default SellerCheck;