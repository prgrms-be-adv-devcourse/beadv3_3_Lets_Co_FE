import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { ManageUserDetailsResponse } from "../../types/response/manageUserDetailsResponse";
import { getUserDetails, blockUser, deleteUser } from "../../api/adminApi"; 

function ManageUserDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<ManageUserDetailsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    // 정지 날짜 입력을 위한 State
    const [blockDate, setBlockDate] = useState<string>("");

    useEffect(() => {
        if (id) {
            fetchUserData(id);
        }
    }, [id]);

    const fetchUserData = async (username: string) => {
        try {
            setLoading(true);
            const data = await getUserDetails(username);
            setUser(data);
        } catch (error) {
            console.error(error);
            alert("정보를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 유저 정지 핸들러
    const handleBlockUser = async () => {
        if (!user || !id) return;
        if (!blockDate) {
            alert("정지할 날짜와 시간을 선택해주세요.");
            return;
        }

        try {
            const formattedDate = blockDate.replace("T", " ") + ":00.000";

            await blockUser(id, { localDateTime: formattedDate });
            
            alert("유저가 정지 처리되었습니다.");
            
            fetchUserData(id);
            setBlockDate(""); // 입력창 초기화
        } catch (error) {
            console.error(error);
            alert("정지 처리에 실패했습니다.");
        }
    };

    // 유저 삭제 핸들러
    const handleDeleteUser = async () => {
        if (!user || !id) return;

        // 실수 방지를 위한 확인창
        if (!window.confirm(`정말로 아이디 [${user.id}] 유저를 삭제하시겠습니까?`)) {
            return;
        }

        try {
            await deleteUser(id);
            alert("유저가 삭제되었습니다.");
            navigate(-1); // 삭제 후 목록 페이지로 이동
        } catch (error) {
            console.error(error);
            alert("삭제에 실패했습니다.");
        }
    };

    const formatDate = (timestamp: number | undefined) => {
        if (!timestamp) return "-";
        return new Date(timestamp).toLocaleDateString("ko-KR", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit"
        });
    };

    if (loading) return <div>로딩 중...</div>;
    if (!user) return <div>데이터가 없습니다.</div>;

    return (
        <div>
            <h1>유저 상세 정보</h1>
            <button onClick={() => navigate(-1)}>목록으로 돌아가기</button>
            <hr />

            <div>
                <h3>관리자 기능</h3>
                
                <div>
                    <label>정지 해제일 지정: </label>
                    <input 
                        type="datetime-local" 
                        value={blockDate}
                        onChange={(e) => setBlockDate(e.target.value)}
                    />
                    <button onClick={handleBlockUser}>
                        유저 정지(Block)
                    </button>
                </div>

                <div>
                    <button onClick={handleDeleteUser}>
                        유저 삭제(Delete)
                    </button>
                </div>
            </div>
            <hr />

            <div>
                <h3>기본 정보</h3>
                <p><strong>아이디:</strong> {user.id}</p>
                <p><strong>이름:</strong> {user.name}</p>
                <p><strong>권한:</strong> {user.role}</p>
                <p><strong>멤버십:</strong> {user.membership}</p>
                <p><strong>이메일:</strong> {user.mail}</p>
                <p><strong>전화번호:</strong> {user.phoneNumber}</p>
                <p><strong>생년월일:</strong> {user.birth}</p>
                <p><strong>성별:</strong> {user.gender}</p>
                <p><strong>잔액:</strong> {user.balance}</p>
            </div>

            <hr />

            <div>
                <h3>날짜 정보</h3>
                <p><strong>가입일:</strong> {formatDate(user.createdAt)}</p>
                <p><strong>수정일:</strong> {formatDate(user.updatedAt)}</p>
                <p>
                    <strong>정지일:</strong> {user.lockedUntil ? formatDate(user.lockedUntil) : "-"}
                </p>
                <p><strong>약관동의:</strong> {formatDate(user.agreeTermsAt)}</p>
                <p><strong>마케팅동의:</strong> {formatDate(user.agreeMarketingAt)}</p>
            </div>

            <hr />

            <div>
                <h3>주소지 목록</h3>
                {user.addressListDTO && user.addressListDTO.length > 0 ? (
                    user.addressListDTO.map((addr, index) => (
                        <p key={index}>
                            [{index + 1}] {JSON.stringify(addr)}
                        </p>
                    ))
                ) : (
                    <p>등록된 주소가 없습니다.</p>
                )}
            </div>

            <hr />

            <div>
                <h3>카드 목록</h3>
                {user.CardListDTO && user.CardListDTO.length > 0 ? (
                    user.CardListDTO.map((card, index) => (
                        <p key={index}>
                            [{index + 1}] {JSON.stringify(card)}
                        </p>
                    ))
                ) : (
                    <p>등록된 카드가 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default ManageUserDetails;