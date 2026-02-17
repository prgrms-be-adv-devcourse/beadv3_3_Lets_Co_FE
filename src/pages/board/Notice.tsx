import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { NoticeResponse } from "../../types/response/noticeResponse";
import { getNoticeList } from "../../api/noticeApi";

function Notice() {

    const [loading, setLoading] = useState(false);
    const [notices, setNotices] = useState<NoticeResponse[]>([]);
    const [page, setPage] = useState(0);

    const PAGE_SIZE = 5;

    const fetchNotice = async (page: number) => {
        try {
            setLoading(true);
            const data = await getNoticeList(page, PAGE_SIZE);
            setNotices(data.items);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNotice(page);
    }, [page])

    const handleNextPage = () => {
        setPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        setPage((prev) => Math.max(0, prev - 1));
    };

    return (
        <div>
            <h1>공지</h1>

            <Link to={'/board/notice/add'}>공지 작성 - 관리자</Link>

            {loading ? (
                <div>로딩중 ...</div>
            ) : (
                <>
                    <table border={1}>
                        <thead>
                            <tr>
                                <td>카테고리</td>
                                <td>제목</td>
                                <td>상태</td>
                                <td>조회수</td>
                                <td>수정일</td>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>작성된 공지가 없습니다.</td>
                                </tr>
                            ) : (
                                notices.map((notice) => (
                                    <tr key={notice.Code}>
                                        <td>{notice.Category}</td>
                                        <td>
                                            <Link to={`${notice.Code}`}>
                                                {notice.title}
                                            </Link>
                                        </td>
                                        <td>{notice.status}</td>
                                        <td>{notice.viewCount}</td>
                                        <td>{notice.updatedAt}</td>
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
                            disabled={notices.length < PAGE_SIZE} 
                        >
                            다음
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Notice;