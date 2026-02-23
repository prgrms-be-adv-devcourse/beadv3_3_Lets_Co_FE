import { useState, type FormEvent } from "react";
import { sellerRegister } from "../../api/sellerApi";
import type { SellerRegisterRequest } from "../../types/request/sellerRegisterRequest";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import logo from "../../assets/logo.png";

function SellerRegister() {

    const [sellerName, setSellerName] = useState('');
    const [businessLicense, setBusinessLicense] = useState('');
    const [bankBrand, setBankBrand] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankToken, setBankToken] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {

        e.preventDefault();

        if (!businessLicense || !bankBrand || !bankName || !bankToken) {
            alert("항목을 모두 입력해주세요.");
            return;
        }

        const sellerData: SellerRegisterRequest = {
            sellerName: sellerName,
            businessLicense: businessLicense,
            bankBrand: bankBrand,
            bankName: bankName,
            bankToken: bankToken
        };

        try {
            await sellerRegister(sellerData);

            alert("판매자 신청 완료. 코드인증이 필요합니다.");
            navigate('/seller/check');

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

            {/* 판매자 신청 카드 */}
            <div className="w-full max-w-lg bg-white p-10 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">판매자 신청</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                        <input
                            type="text"
                            value={sellerName}
                            onChange={(e) => setSellerName(e.target.value)}
                            placeholder="판매자 성함을 입력하세요"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">사업자 번호 *</label>
                        <input
                            type="text"
                            value={businessLicense}
                            onChange={(e) => setBusinessLicense(e.target.value)}
                            placeholder="예: 220-81-62517"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">은행명 *</label>
                            <input
                                type="text"
                                value={bankBrand}
                                onChange={(e) => setBankBrand(e.target.value)}
                                placeholder="예: KB국민은행"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">예금주 *</label>
                            <input
                                type="text"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="예: 미래유통"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">계좌 번호 (토큰) *</label>
                        <input
                            type="text"
                            value={bankToken}
                            onChange={(e) => setBankToken(e.target.value)}
                            placeholder="예: 400401-01-284912"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors shadow-sm mt-4"
                    >
                        제출하기
                    </button>
                </form>

                <hr className="border-gray-100 my-8" /> 

                {/* 입력 예시 안내 박스 */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                        <span className="mr-2">💡</span> 입력 예시
                    </h3>
                    <div className="grid grid-cols-3 gap-y-2 text-sm">
                        <div className="font-medium text-gray-500">이름</div>
                        <div className="col-span-2 text-gray-700">홍길동</div>
                        
                        <div className="font-medium text-gray-500">사업자 번호</div>
                        <div className="col-span-2 text-gray-700">220-81-62517</div>
                        
                        <div className="font-medium text-gray-500">은행명</div>
                        <div className="col-span-2 text-gray-700">KB국민은행</div>
                        
                        <div className="font-medium text-gray-500">예금주</div>
                        <div className="col-span-2 text-gray-700">미래유통</div>
                        
                        <div className="font-medium text-gray-500">계좌 번호</div>
                        <div className="col-span-2 text-gray-700">400401-01-284912</div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SellerRegister;