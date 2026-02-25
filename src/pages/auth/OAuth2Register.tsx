import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { oAuth2Register, profile } from "../../api/userApi";
import { GENDER_OPTIONS } from "../../types/genderStatus";
import type { OAuth2RegisterRequest } from "../../types/request/oAuth2RegisterRequest";
import logo from "../../assets/logo.png";

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
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!mail || !emailRegex.test(mail) || mail.length > 100) {
            alert("올바른 이메일 형식을 100자 이내로 입력해주세요.");
            return;
        }
        
        if (!gender) {
            alert("성별을 선택해주세요.");
            return;
        }

        const birthRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
        if (!birthRegex.test(birth)) {
            alert("생년월일 형식이 올바르지 않습니다. (예: 1990-01-01)");
            return;
        }

        const today = new Date();
        const birthDate = new Date(birth);
        let age = today.getFullYear() - birthDate.getFullYear();

        if (age < 14) {
            alert("만 14세 미만은 가입할 수 없습니다.");
            return;
        }

        const phoneRegex = /^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$/;
        if (!phoneRegex.test(phoneNum)) {
            alert("휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)");
            return;
        }

        const userData: OAuth2RegisterRequest = {
            mail: mail.trim(),
            name: name.trim(),
            gender: gender,
            phoneNumber: phoneNum,
            birth: birth
        };

        try {
            const response = await oAuth2Register(userData);

            // API 성공 여부 판단
            if (response.data && response.data.success === false) {
                // 실패 메시지 있을 경우 표시
                alert(response.data.message || "정보 등록에 실패했습니다. 입력값을 확인해주세요.");
                return;
            }

            alert("정보 등록이 완료되었습니다!");
            navigate('/'); 
        } catch (error) {
            alert("처리 중 알 수 없는 오류가 발생했습니다.");
            console.error("예상치 못한 에러:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 min-h-screen">
            {/* 로고 영역 */}
            <div className="mb-8">
                <Link to="/">
                    <img src={logo} alt="Gutjjeu Logo" className="w-36 h-auto object-contain" />
                </Link>
            </div>

            {/* 카드 섹션 */}
            <div className="w-full max-w-lg bg-white p-10 rounded-xl shadow-sm border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">추가 정보 입력</h1>
                    <p className="text-sm text-gray-500">원활한 서비스 이용을 위해 필수 정보를 입력해주세요.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 이메일 입력 섹션 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일 *</label>
                        <input 
                            type="email" 
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
                            placeholder="이메일을 입력해주세요"
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                                mail.includes('@oauth.com') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                        />
                        {mail.includes('@oauth.com') && (
                            <p className="mt-2 text-xs text-red-500 font-medium">
                                * 발급된 임시 이메일입니다. 실제 사용하시는 이메일로 변경해 주세요.
                            </p>
                        )}
                    </div>

                    {/* 이름 입력 섹션 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="실명을 입력해주세요"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>

                    {/* 성별 및 생년월일 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">성별 *</label>
                            <select 
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white"
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">생년월일 *</label>
                            <input 
                                type="date"  
                                value={birth}
                                onChange={(e) => setBirth(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* 핸드폰 번호 섹션 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">핸드폰 번호 *</label>
                        <input 
                            type="tel" 
                            value={phoneNum}
                            onChange={(e) => setPhoneNum(e.target.value)}
                            placeholder="010-0000-0000"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors shadow-sm"
                        >
                            가입 완료하기
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-xs text-gray-400">
                    정보 입력을 완료하시면 Gutjjeu의 모든 서비스를 이용하실 수 있습니다.
                </div>
            </div>
        </div>
    );
}

export default OAuth2Register;