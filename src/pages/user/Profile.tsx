import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { UserProfileResponse } from "../../types/response/userProfileResponse";
import { profile } from "../../api/userApi";

function Profile() {
    const [userProfile, setProfile] = useState<UserProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await profile();
                setProfile(data.data);
            } catch (error) {
                console.error("내 정보 불러오기 실패:", error);
                alert("정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 날짜 형식 변환 함수
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "정보 없음";
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800"></div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500">회원 정보를 찾을 수 없습니다.</p>
                <Link to="/my" className="mt-4 inline-block text-blue-600 font-semibold hover:underline">
                    마이페이지로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">내 정보 상세</h1>
                <Link to="/my" className="text-sm text-gray-500 hover:text-gray-800 transition-colors font-medium">
                    마이페이지로 돌아가기
                </Link>
            </div>

            {/* 정보 카드 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 space-y-7">
                    
                    {/* 성함 & 이메일 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">성함</span>
                            <span className="text-lg font-bold text-gray-800">{userProfile.name}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">이메일</span>
                            <span className="text-lg font-bold text-gray-800">{userProfile.mail}</span>
                        </div>
                    </div>

                    <hr className="border-gray-50" />

                    {/* 연락처 & 생년월일 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">핸드폰 번호</span>
                            <span className="text-lg font-medium text-gray-800">{userProfile.phoneNumber}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">생년월일</span>
                            <span className="text-lg font-medium text-gray-800">{userProfile.birth}</span>
                        </div>
                    </div>

                    {/* 성별 */}
                    <div className="flex flex-col space-y-1">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">성별</span>
                        <span className="text-lg font-medium text-gray-800">
                            {userProfile.gender === 'M' ? '남성' : userProfile.gender === 'F' ? '여성' : userProfile.gender}
                        </span>
                    </div>

                    <hr className="border-gray-50" />

                    {/* 마케팅 동의 상태 */}
                    <div className="flex flex-col space-y-2 bg-gray-50 p-4 rounded-lg">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">마케팅 정보 수신 동의</span>
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-bold ${userProfile.agreeMarketingAt ? 'text-blue-600' : 'text-gray-400'}`}>
                                {userProfile.agreeMarketingAt ? '동의함' : '동의하지 않음'}
                            </span>
                            {userProfile.agreeMarketingAt && (
                                <span className="text-xs text-gray-500">
                                    동의 일시: {formatDate(userProfile.agreeMarketingAt)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 하단 버튼 영역 */}
                <div className="bg-gray-50/50 px-8 py-4 flex justify-end border-t border-gray-100">
                    <button 
                        onClick={() => alert("정보 수정 기능은 준비 중입니다.")}
                        className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        정보 수정하기
                    </button>
                </div>
            </div>

            <div className="mt-8 text-center px-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                    회원님의 소중한 개인정보는 암호화되어 안전하게 보호되고 있습니다.<br />
                    정보 변경이 필요하신 경우 수정 버튼을 이용해 주세요.
                </p>
            </div>
        </div>
    );
}

export default Profile;