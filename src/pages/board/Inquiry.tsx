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
    };

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
        <div className="max-w-5xl mx-auto">
            {/* 타이틀 및 작성 버튼 영역 */}
            <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">문의 게시판</h1>
                    <p className="text-sm text-gray-500 mt-2">궁금하신 점을 남겨주시면 빠르게 답변해 드리겠습니다.</p>
                </div>
                {/* 문의 작성 버튼 */}
                <Link 
                    to={'/board/inquiry/add'} 
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    문의 작성
                </Link>
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
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-28 text-center">공개여부</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-32">작성일</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {inquiries.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            등록된 문의가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    inquiries.map((item) => (
                                        <tr key={item.code} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${item.status === '답변완료' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-base text-gray-800 font-medium">
                                                <Link to={`/board/inquiry/${item.code}`} className="hover:underline hover:text-blue-600 transition-colors flex items-center gap-2">
                                                    {item.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${item.isPrivate ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                                                    {item.isPrivate ? "비공개" : "공개"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{item.inquiryCreatedAt}</td>
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
                            disabled={inquiries.length < PAGE_SIZE} 
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

export default Inquiry;