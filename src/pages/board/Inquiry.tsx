import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { InquiryResponse } from "../../types/response/inquiryResponse";
import { getInquiryList } from "../../api/inquiryApi";

function Inquiry() {
    const [loading, setLoading] = useState(false);
    const [inquiries, setInquiries] = useState<InquiryResponse[]>([]);
    const [page, setPage] = useState(0);

    const PAGE_SIZE = 10;

    const fetchInquiry = async (page: number) => {
        try {
            setLoading(true);
            const data = await getInquiryList(page, PAGE_SIZE);
            setInquiries(data.list || data); 
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInquiry(page);
    }, [page]);

    const handleNextPage = () => {
        setPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        setPage((prev) => Math.max(0, prev - 1));
    };

    return (
        <div>
            <h1>문의 게시판</h1>

            <Link to={'/board/inquiry/add'}>문의 작성</Link>

            {loading ? (
                <div>로딩중 ...</div>
            ) : (
                <>
                    <table border={1}>
                        <thead>
                            <tr>
                                <td>카테고리</td>
                                <td>상태</td>
                                <td>제목</td>
                                <td>비공개여부</td>
                                <td>작성일</td>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>등록된 문의가 없습니다.</td>
                                </tr>
                            ) : (
                                inquiries.map((item) => (
                                    <tr key={item.code}>
                                        <td>{item.category}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <Link to={`${item.code}`}>
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td>{item.isPrivate ? "비공개" : "공개"}</td>
                                        <td>{item.inquiryCreatedAt}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <div>
                        <button 
                            onClick={handlePrevPage} 
                            disabled={page === 0}
                        >
                            이전
                        </button>
                        
                        <span>현재 페이지: {page + 1}</span>

                        <button 
                            onClick={handleNextPage} 
                            disabled={inquiries.length < PAGE_SIZE} 
                        >
                            다음
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Inquiry;