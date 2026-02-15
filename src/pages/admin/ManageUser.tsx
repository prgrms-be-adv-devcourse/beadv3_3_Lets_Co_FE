import { useEffect, useState } from "react";
import type { ManageUserListResponse } from "../../types/response/manageUserListResponse";
import { getUserList, type UserListParams } from "../../api/adminApi"; 
import { useNavigate } from "react-router-dom";

function ManageUser() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<ManageUserListResponse[]>([]);

    const [page, setPage] = useState<number>(1);
    
    const [requestParams, setRequestParams] = useState<UserListParams>({
        itemsPerPage: 10,
        colum: "DEFAULT",
        sorting: "DEFAULT"
    });


    useEffect(() => {
        fetchUserData();
    }, [page, requestParams]); 

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const data = await getUserList(page, requestParams);
            
            setUsers(data); 

        } catch (error) {
            console.error("유저 목록 불러오기 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (username: string) => {
        navigate(`/admin/users/${username}`);
    };

    const formatDate = (timestamp: number | undefined) => {
        if (!timestamp) return "-";
        return new Date(timestamp).toLocaleDateString("ko-KR", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit"
        });
    };

    return (
        <div>
            <h1>유저 관리 (관리자)</h1>

            <select 
                value={requestParams.itemsPerPage} 
                onChange={(e) => setRequestParams({...requestParams, itemsPerPage: Number(e.target.value)})}
            >
                <option value={10}>10개씩 보기</option>
                <option value={20}>20개씩 보기</option>
                <option value={50}>50개씩 보기</option>
            </select>

            <table border={1}>
                <thead>
                    <tr>
                        <th>권한</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>정지일</th>
                        <th>생성일</th>
                        <th>수정일</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6}>로딩 중입니다...</td>
                        </tr>
                    ) : users && users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.role}</td>
                                <td onClick={() => handleUserClick(user.id)}>
                                    {user.id}
                                </td>
                                <td>{user.name}</td>
                                <td>{user.lockedUntil ? formatDate(user.lockedUntil) : "-"}</td>
                                <td>{formatDate(user.createdAt)}</td>
                                <td>{formatDate(user.updatedAt)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6}>등록된 유저가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div>
                <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>
                    이전
                </button>
                <span>현재 페이지: {page}</span>
                <button onClick={() => setPage(prev => prev + 1)}>
                    다음
                </button>
            </div>
        </div>
    );
}

export default ManageUser;