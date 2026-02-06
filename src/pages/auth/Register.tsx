import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/authApi";
import type { RegisterRequest } from "../../types/request/registerRequest";

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [birth, setBirth] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivate, setAgreePrivate] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);

    const navigate = useNavigate();
    const now = new Date().toISOString();

    const handleSubmit = async (e: FormEvent) => {

        e.preventDefault(); 

        if (!username || !password || !name) {
            alert("필수 항목을 모두 입력해주세요.");
            return;
        }
     
        if (!agreeTerms || !agreePrivate) {
            alert("필수 약관에 동의해주세요.");
            return;
        }
        
        const userData: RegisterRequest = {
            ID: username, 
            PW: password,
            name: name,
            phoneNumber: phoneNum,
            birth: birth,
            agreeTermsAt: now,
            agreePrivateAt: now,
            agreeMarketingAt: agreeMarketing ? now : null
        };

        console.log("전송 데이터 확인:", userData);

        try {
            await register(userData);
            
            alert("회원가입 성공! 인증을 진행합니다.");
            navigate('/checkCode');

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
                    <label>ID: </label>
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="아이디"
                    />
                </div>

                <div>
                    <label>Password: </label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호"
                    />
                </div>

                <div>
                    <label>이름: </label>
                    <input 
                        type="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="성함"
                    />
                </div>

                <div>
                    <label>핸드폰: </label>
                    <input 
                        type="phoneNum" 
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

            <Link to="/login">로그인 화면</Link>
        </div>
    );
};
