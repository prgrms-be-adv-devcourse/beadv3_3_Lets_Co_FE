import { useEffect, useState } from "react";
import { getSellerQnAList } from "../../api/sellerApi";
import type { SellerQnaResponse } from "../../types/response/SellerQnaResponse";
import { BOARD_CATEGORY_LABELS } from "../../types/boardCategory";
import { BOARD_STATUS_LABELS } from "../../types/boardStatus";
import { Link } from "react-router-dom";

function SellerQnAList() {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [qnas, setQnA] = useState<SellerQnaResponse[]>([]);

    const SIZE = 5;

    const fetchQnA = async (page: number) => {
        try {
            setLoading(true);
            const data = await getSellerQnAList(page, SIZE);
            setQnA(data.items); 
        } catch (error) {
            console.error("QnA 로딩 실패:", error);
            alert("QnA 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQnA(page);
    }, [page]);

    return (
        <div>
            <h1>제품 문의 관리 (판매자)</h1>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <table border={1}>
                    <thead>
                        <tr>
                            <th>이미지</th>
                            <th>카테고리</th>
                            <th>상태</th> 
                            <th>제목</th>
                            <th>작성자</th> 
                            <th>조회수</th>
                            <th>상품코드</th>
                            <th>상품명</th>
                            <th>생성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {qnas.length > 0 ? (
                            qnas.map((qna) => (
                                <tr key={qna.code}>
                                    <td>
                                        {qna.imageUrl ? (
                                            <img src={qna.imageUrl} alt={qna.name} width="50" height="50" />
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </td>
                                    <td>{BOARD_CATEGORY_LABELS[qna.category] || qna.category}</td>
                                    
                                    <td>
                                        {BOARD_STATUS_LABELS[qna.status] || qna.status}
                                    </td>
                                    
                                    <td>{qna.title}</td>
                                    <td>{qna.userName}</td>
                                    <td>{qna.viewCount?.toLocaleString()}</td>
                                    <td>{qna.productCode}</td>
                                    <Link to={`/products/${qna.productCode}`}>
                                        <h3>{qna.name}</h3>
                                    </Link>
                                    <td>{qna.createdAt}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9}>
                                    문의 내역이 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <div>
                <button 
                    disabled={page === 1} 
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                >
                    이전
                </button>
                <span> 현재 페이지: {page} </span>
                <button 
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={qnas.length < SIZE}
                >
                    다음
                </button>
            </div>
        </div>
    );
}

export default SellerQnAList;
