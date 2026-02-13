import { useState, type FormEvent } from "react";
import { sellerRegister } from "../../api/sellerApi";
import type { SellerRegisterRequest } from "../../types/request/sellerRegisterRequest";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

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
        <div>
            <form onSubmit={handleSubmit}>

                <div>
                    <label>이름</label>
                    <input
                        type="text"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        placeholder="판매자 성함"
                    />
                </div>

                <div>
                    <label>사업자 번호</label>
                    <input
                        type="text"
                        value={businessLicense}
                        onChange={(e) => setBusinessLicense(e.target.value)}
                        placeholder="사업자 번호"
                    />
                </div>

                <div>
                    <label>은행명</label>
                    <input
                        type="text"
                        value={bankBrand}
                        onChange={(e) => setBankBrand(e.target.value)}
                        placeholder="은행명"
                    />
                </div>

                <div>
                    <label>예금주</label>
                    <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="예금주"
                    />
                </div>

                <div>
                    <label>계좌 번호(토큰)</label>
                    <input
                        type="text"
                        value={bankToken}
                        onChange={(e) => setBankToken(e.target.value)}
                        placeholder="계좌 번호(토큰)"
                    />
                </div>
                
                <button type="submit">제출</button>
            </form>

            <hr/> <br/> <br/>

            <div>
                <label>예시)</label>
                <p>홍길동</p>
                <p>220-81-62517</p>
                <p>KB국민은행</p>
                <p>미래유통</p>
                <p>400401-01-284912</p>
            </div>

        </div>
    );
}

export default SellerRegister;