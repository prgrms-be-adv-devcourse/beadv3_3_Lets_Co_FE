import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { oAuth2Register, profile } from "../../api/userApi";
import { GENDER_OPTIONS } from "../../types/genderStatus";
import type { OAuth2RegisterRequest } from "../../types/request/oAuth2RegisterRequest";

function OAuth2Register() {
    const [mail, setMail] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [birth, setBirth] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyInfo = async () => {
            try {
                const response = await profile(); 
                const userInfo = response.data; 

                if (userInfo && userInfo.mail) {
                    setMail(userInfo.mail);
                }
                
                if (userInfo.name) setName(userInfo.name); 

            } catch (error) {
                console.error("정보 불러오기 실패:", error);
                setMail("");
            }
        };

        fetchMyInfo();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault(); 
        
        if (!mail.trim()) {
            alert("이메일을 입력해주세요.");
            return;
        }
        const emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        if (!emailRegExp.test(mail)) {
            alert("올바른 이메일 형식을 입력해주세요.");
            return;
        }

        if (!name.trim()) {
            alert("이름을 입력해주세요.");
            return;
        }
        if (!gender) {
            alert("성별을 선택해주세요.");
            return;
        }
        if (!birth) {
            alert("생년월일을 입력해주세요.");
            return;
        }

        const phoneRegExp = /^01[016789]-?\d{3,4}-?\d{4}$/;
        if (!phoneRegExp.test(phoneNum)) {
            alert("올바른 핸드폰 번호 형식을 입력해주세요.");
            return;
        }

        const userData: OAuth2RegisterRequest = {
            mail: mail.trim(),
            name: name.trim(),
            gender: gender,
            phoneNumber: phoneNum,
            birth: birth
        };

        console.log("전송 데이터 확인:", userData);

        try {
            await oAuth2Register(userData);
            
            alert("정보 등록이 완료되었습니다!");
            navigate('/'); 

        } catch (error) {
            alert("처리 중 알 수 없는 오류가 발생했습니다.");
            console.error("예상치 못한 에러:", error);
        }
    };

    return (
        <div>
            <h2>추가 정보 입력</h2>
            <form onSubmit={handleSubmit}>

                <div>
                    <label>이메일: </label>
                    <input 
                        type="email" 
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        placeholder="이메일을 입력해주세요"
                    />
                    {mail.includes('@oauth.com') && (
                        <span style={{ color: 'red'}}>
                            * 발급된 임시 이메일입니다. 회원가입하신 이메일로 변경해 주세요.
                        </span>
                    )}
                </div>

                <div>
                    <label>이름: </label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="실명을 입력해주세요"
                    />
                </div>

                <div>
                    <label>성별: </label>
                    <select 
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="">선택해주세요</option>
                        {GENDER_OPTIONS && GENDER_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>핸드폰: </label>
                    <input 
                        type="tel" 
                        value={phoneNum}
                        onChange={(e) => setPhoneNum(e.target.value)}
                        placeholder="010-0000-0000"
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

                <button type="submit">
                    가입 완료하기
                </button>
            </form>
        </div>
    );
};

export default OAuth2Register;