import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/authApi";
import type { RegisterRequest } from "../../types/request/registerRequest";
import { GENDER_OPTIONS } from "../../types/genderStatus";
import logo from "../../assets/logo.png";

function LocalRegister() {
    const [username, setUsername] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [pwCheck, setPwCheck] = useState('');
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

        if (!username || !password || !name) {
            alert("필수 항목을 모두 입력해주세요.");
            return;
        }
     
        if (!agreeTerms || !agreePrivate) {
            alert("필수 약관에 동의해주세요.");
            return;
        }

/*
        // 유효성 검사 - 위 방식 말고 다른 방식도 있음..
        // 정규 표현식 이용해서 비쥬얼 적으로 
        let regExp = /^[A-Za-z0-9]{5, 10}$/;
        let str = "user01";  // 6글자, 영문자 포함, 숫자 포함

        if(regExp.test(str)) {
            // true
        }
        
        // 몇글자 이상 영문, 숫자 포함 - 정규 표현식1
        // 특수문자 포함 - 정규 표현식2
        // 연속된 글자 불가 - 정규 표현식3
*/

        const userData: RegisterRequest = {
            ID: username, 
            Mail: mail,
            PW: password,
            PW_CHECK: pwCheck,
            name: name,
            gender: gender,
            phoneNumber: phoneNum,
            birth: birth,
            agreeTermsAt: now,
            agreePrivateAt: now,
            agreeMarketingAt: agreeMarketing ? now : null
        };

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
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50">
            {/* 로고 영역 */}
            <div className="mb-8">
                <Link to="/">
                    <img src={logo} alt="Gutjjeu Logo" className="w-36 h-auto object-contain" />
                </Link>
            </div>

            {/* 회원가입 카드 */}
            <div className="w-full max-w-lg bg-white p-10 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">회원가입</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* 계정 정보 섹션 */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">계정 정보</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">아이디 *</label>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="사용할 아이디를 입력하세요"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                            <input 
                                type="text" 
                                value={mail}
                                onChange={(e) => setMail(e.target.value)}
                                placeholder="example@mail.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 *</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인 *</label>
                                <input 
                                    type="password" 
                                    value={pwCheck}
                                    onChange={(e) => setPwCheck(e.target.value)}
                                    placeholder="한 번 더 입력"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 개인 정보 섹션 */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">개인 정보</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="실명을 입력하세요"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                                <select 
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
                                >
                                    <option value="">선택</option>
                                    {GENDER_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
                                <input 
                                    type="date"  
                                    value={birth}
                                    onChange={(e) => setBirth(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">핸드폰 번호</label>
                            <input 
                                type="text" 
                                value={phoneNum}
                                onChange={(e) => setPhoneNum(e.target.value)}
                                placeholder="010-0000-0000"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 약관 동의 섹션 */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                id="agreeTerms"
                                checked={agreeTerms} 
                                onChange={(e) => setAgreeTerms(e.target.checked)} 
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700">이용약관 동의 (필수)</label>
                        </div>
                        <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                id="agreePrivate"
                                checked={agreePrivate} 
                                onChange={(e) => setAgreePrivate(e.target.checked)} 
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="agreePrivate" className="ml-2 text-sm text-gray-700">개인정보 수집 및 이용 동의 (필수)</label>
                        </div>
                        <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                id="agreeMarketing"
                                checked={agreeMarketing} 
                                onChange={(e) => setAgreeMarketing(e.target.checked)} 
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="agreeMarketing" className="ml-2 text-sm text-gray-700">마케팅 정보 수신 동의 (선택)</label>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        가입 완료하기
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    이미 계정이 있으신가요?{" "}
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                        로그인하기
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LocalRegister;