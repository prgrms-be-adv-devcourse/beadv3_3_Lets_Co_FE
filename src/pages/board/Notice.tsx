import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { NoticeResponse } from "../../types/response/noticeResponse";
import { getNoticeList } from "../../api/noticeApi";
import { useAuth } from "../../context/AuthContext";

function Notice() {
    const { userRole } = useAuth();
    
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
    };

    useEffect(() => {
        fetchNotice(page);
    }, [page]);

    const handleNextPage = () => {
        setPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        setPage((prev) => Math.max(0, prev - 1));
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* 타이틀 및 작성 버튼 영역 */}
            <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">공지사항</h1>
                    <p className="text-sm text-gray-500 mt-2">새로운 소식과 안내를 확인하세요.</p>
                </div>
                
                {/* 관리자(ADMIN)일 경우에만 공지 작성 버튼 표시 */}
                {userRole === "ADMIN" && (
                    <Link 
                        to={'/board/notice/add'} 
                        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        공지 작성
                    </Link>
                )}
            </div>

            {loading ? (
                // 로딩 상태
                <div className="flex justify-center items-center h-40 text-gray-500 font-medium">
                    데이터를 불러오는 중입니다...
                </div>
            ) : (
                <>
                    {/* 게시판 테이블 영역 */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-24">카테고리</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-24">상태</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">제목</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-24">조회수</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-32">수정일</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {notices.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            작성된 공지가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    notices.map((notice) => (
                                        <tr key={notice.Code} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-500">{notice.Category}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                                                    {notice.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-base text-gray-800 font-medium">
                                                <Link to={`/board/notice/${notice.Code}`} className="hover:underline hover:text-blue-600 transition-colors">
                                                    {notice.title}
                                                </Link>
                                            </td>
                                            
                                            <td className="px-6 py-4 text-sm text-gray-500">{notice.viewCount}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{notice.updatedAt}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이지네이션 영역 */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button 
                            onClick={handlePrevPage} 
                            disabled={page === 0}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            이전
                        </button>
                        
                        <span className="text-sm font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                            {page + 1}
                        </span>

                        <button 
                            onClick={handleNextPage} 
                            disabled={notices.length < PAGE_SIZE} 
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
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