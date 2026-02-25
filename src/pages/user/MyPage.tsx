import { useEffect, useState } from "react";
import { myPage } from "../../api/userApi";
import type { UserResponse } from "../../types/response/userResponse";
import { Link, useNavigate } from "react-router-dom";

function MyPage() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await myPage();
                setUser(data.data);
            } catch (error) {
                console.error("내 정보 불러오기 실패:", error);
                alert("정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-800"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100 mx-4">
                <p className="text-gray-500">회원 정보를 찾을 수 없습니다.</p>
                <button onClick={() => navigate('/login')} className="mt-4 text-blue-600 font-semibold hover:underline">
                    로그인하러 가기
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">마이페이지</h1>

            {/* 유저 기본 정보 카드 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
                <div className="mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-800">{user.id}</h2>
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 uppercase">
                            {user.role}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1.5 font-medium">
                        가입일: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                </div>

                {/* 잔액 섹션 */}
                <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">보유 잔액</p>
                        <p className="text-2xl font-bold text-gray-800">
                            {user.balance.toLocaleString()} <span className="text-lg font-medium">원</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate("/charge")}
                        className="bg-gray-800 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        충전하기
                    </button>
                </div>
            </div>

            {/* 메뉴 리스트 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to='/my/profile' className="flex flex-col justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                    <span className="text-sm text-gray-400 font-medium mb-1">상세 정보 조회</span>
                    <span className="font-bold text-gray-700 text-lg group-hover:text-blue-600">내 정보 관리</span>
                </Link>

                <Link to='/my/address' className="flex flex-col justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                    <span className="text-sm text-gray-400 font-medium mb-1">배송지 설정</span>
                    <span className="font-bold text-gray-700 text-lg group-hover:text-blue-600">주소지 관리</span>
                </Link>

                <Link to='/my/card' className="flex flex-col justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                    <span className="text-sm text-gray-400 font-medium mb-1">결제 수단 설정</span>
                    <span className="font-bold text-gray-700 text-lg group-hover:text-blue-600">결제 수단 관리</span>
                </Link>

                <Link to='/my/orders' className="flex flex-col justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                    <span className="text-sm text-gray-400 font-medium mb-1">구매 이력 확인</span>
                    <span className="font-bold text-gray-700 text-lg group-hover:text-blue-600">주문 내역 조회</span>
                </Link>
            </div>
        </div>
    );
}

export default MyPage;