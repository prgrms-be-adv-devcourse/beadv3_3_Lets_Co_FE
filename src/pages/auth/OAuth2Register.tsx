import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { oAuth2Register } from "../../api/authApi";
import { GENDER_OPTIONS } from "../../types/genderStatus";
import type { OAuth2RegisterRequest } from "../../types/request/oauth2RegisterRequest";

function OAuth2Register() {

    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [birth, setBirth] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivate, setAgreePrivate] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);

    const navigate = useNavigate();
    const now = new Date().toISOString();

    const handleSubmit = async (e: FormEvent) => {

        e.preventDefault(); 

        if (!agreeTerms || !agreePrivate) {
            alert("필수 약관에 동의해주세요.");
            return;
        }
        
        // 유효성 검사 - 위 방식 말고 다른 방식도 있음..
        // 정규 표현식 이용해서 비쥬얼 적으로 
        /*
            let regExp = /^[A-Za-z0-9]{5, 10}$/;
            let str = "user01";  // 6글자, 영문자 포함, 숫자 포함

            if(regExp.test(str)) {
                // true
            }
            
            // 몇글자 이상 영문, 숫자 포함 - 정규 표현식1
            // 특수문자 포함 - 정규 표현식2
            // 연속된 글자 불가 - 정규 표현식3
        */

        const userData: OAuth2RegisterRequest = {
            name: name,
            gender: gender,
            phoneNumber: phoneNum,
            birth: birth,
            agreeTermsAt: now,
            agreePrivateAt: now,
            agreeMarketingAt: agreeMarketing ? now : null
        };

        console.log("전송 데이터 확인:", userData);

        try {
            await oAuth2Register(userData);
            
            alert("회원가입 성공!");
            navigate('/my');

        } catch (error) {
            alert("알 수 없는 오류가 발생했습니다.");
            console.error("예상치 못한 에러:", error);
        }
    };

    return (
        <div>
            <h2>회원가입</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>이름: </label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="성함"
                    />
                </div>

                <div>
                    <label>성별: </label>
                    <select 
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="">선택해주세요</option>

                        {GENDER_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>핸드폰: </label>
                    <input 
                        type="text" 
                        value={phoneNum}
                        onChange={(e) => setPhoneNum(e.target.value)}
                        placeholder="핸드폰"
                    />
                </div>

                <div>
                    <label>생년월일: </label>
                    <input 
                        type="date"  
                        value={birth}
                        onChange={(e) => setBirth(e.target.value)}
                    />
                </div>

                <div>
                    <label>약관에 동의하시겠습니까?</label>
                    <input 
                        type="checkbox" 
                        checked={agreeTerms} 
                        onChange={(e) => setAgreeTerms(e.target.checked)} 
                    />
                </div>

                <div>
                    <label>개인정보 수집에 동의하시겠습니까?</label>
                        <input 
                            type="checkbox" 
                            checked={agreePrivate} 
                            onChange={(e) => setAgreePrivate(e.target.checked)} 
                        />
                </div>

                <div>
                    <label>마케팅 수신에 동의하시겠습니까?</label>
                        <input 
                            type="checkbox" 
                            checked={agreeMarketing} 
                            onChange={(e) => setAgreeMarketing(e.target.checked)} 
                        />
                </div>

                <button type="submit">가입하기</button>
            
            </form>
        </div>
    );
};

export default OAuth2Register;