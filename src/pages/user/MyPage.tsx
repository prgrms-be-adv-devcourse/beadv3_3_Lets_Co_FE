import { useEffect, useState } from "react";
import { myPage } from "../../api/userApi";
import type { UserResponse } from "../../types/response/userResponse";
import { Link, useNavigate } from "react-router-dom";

function MyPage() {

    const [user, setUser] = useState<UserResponse | null> (null);
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
        return <div>로딩 중...</div>;
    }

    if (!user) {
        return <div>회원 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div>
            <h1>마이페이지</h1>

            <div>
                <div>
                    <span>아이디:</span>
                    <span>{user.id}</span>
                </div>

                <div>
                    <span>권한:</span>
                    <span>{user.role}</span>
                </div>

                <div>
                    <span>잔액:</span>
                    <span>{user.balance.toLocaleString()} 원</span>
                    <button onClick={() => navigate("/charge")}>
                        충전
                    </button>
                </div>

                <div>
                    <span>가입일:</span>
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <Link to='/my/profile'>내 정보</Link> <br/>
            <Link to='/my/address'>주소 정보</Link> <br/>
            <Link to='/my/card'>카드 정보</Link> <br/>
            <Link to='/my/order'>주문 정보</Link>
        </div>
    );
}

export default MyPage;