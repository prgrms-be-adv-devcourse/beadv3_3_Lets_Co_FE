import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { addQnA, getQnAList } from "../../api/qnaApi";
import type { UpsertQnaRequest } from "../../types/response/upsertQnaRequest";
import { BOARD_CATEGORY_LABELS, BOARD_CATEGORY_OPTIONS } from "../../types/boardCategory";
import { BOARD_STATUS_LABELS } from "../../types/boardStatus";
import { Link } from "react-router-dom";
import type { QnAResponse } from "../../types/response/qnaResponse";

interface QnAProps {
    productcode: string;
}

function QnA({ productcode }: QnAProps) {
    const [loading, setLoading] = useState(false);
    const [qnas, setQnA] = useState<QnAResponse[]>([]);
    
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0); 
    
    const [isWriting, setIsWriting] = useState(false);

    const SIZE = 5;

    const [formData, setFormData] = useState<UpsertQnaRequest>({
        category: "PRODUCT",
        title: "",
        content: "",
        name: "",
        isPrivate: false,
        detailCode: "",
        parentCode: "" 
    });

    const fetchQnA = async (pageToFetch: number) => {
        try {
            setLoading(true);
            const data = await getQnAList(productcode, pageToFetch, SIZE);
            
            setQnA(data.content || data.items || []); 
            setTotalPages(data.totalPages || 1); 
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQnA(page);
    }, [page, productcode]);

    // 입력 핸들러
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        
        if (e.target.type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // 제출 핸들러
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.content || !formData.name) {
            alert("제목, 작성자, 내용을 모두 입력해주세요.");
            return;
        }

        try {
            await addQnA(productcode, formData);
            alert("문의가 등록되었습니다.");

            // 폼 초기화
            setFormData({
                category: "PRODUCT",
                title: "",
                content: "",
                name: "",
                isPrivate: false,
                detailCode: "",
                parentCode: ""
            });
            setIsWriting(false);
            setPage(0);
            fetchQnA(0);
        } catch (error) {
            console.error("등록 실패", error);
            alert("문의 등록에 실패했습니다.");
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="w-full space-y-6 p-6">
            <div className="flex justify-end">
                <button 
                    onClick={() => setIsWriting(!isWriting)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition shadow-sm"
                >
                    {isWriting ? "작성 취소" : "문의 작성"}
                </button>
            </div>

            {/* Q&A 작성 폼 영역 */}
            {isWriting && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-semibold text-gray-700">카테고리</label>
                            <select 
                                name="category" 
                                value={formData.category} 
                                onChange={handleChange}
                                className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                {BOARD_CATEGORY_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm font-semibold text-gray-700">작성자</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="이름을 입력하세요"
                                className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-semibold text-gray-700">제목</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            placeholder="제목을 입력하세요"
                            className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none w-full"
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-semibold text-gray-700">내용</label>
                        <textarea 
                            name="content" 
                            value={formData.content} 
                            onChange={handleChange} 
                            placeholder="문의 내용을 상세히 입력해주세요."
                            rows={4}
                            className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none w-full resize-none"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input 
                            type="checkbox" 
                            id="isPrivate"
                            name="isPrivate" 
                            checked={formData.isPrivate} 
                            onChange={handleChange} 
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="isPrivate" className="text-sm text-gray-700 cursor-pointer">비밀글로 설정</label>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button 
                            type="submit"
                            className="px-6 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 transition"
                        >
                            등록하기
                        </button>
                    </div>
                </form>
            )}

            {/* Q&A 목록 영역 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-center w-28">카테고리</th>
                                <th className="px-4 py-3 text-center w-24">상태</th>
                                <th className="px-4 py-3">제목</th>
                                <th className="px-4 py-3 text-center w-32">작성자</th>
                                <th className="px-4 py-3 text-center w-20">조회수</th>
                                <th className="px-4 py-3 text-center w-32">생성일</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                        데이터를 불러오는 중입니다...
                                    </td>
                                </tr>
                            ) : qnas.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                        작성된 QnA가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                qnas.map((qna) => (
                                    <tr key={qna.code} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 text-center">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                                                {BOARD_CATEGORY_LABELS[qna.category] || qna.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-600">
                                            {BOARD_STATUS_LABELS[qna.status] || qna.status}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-xs">
                                            <Link to={`/products/${productcode}/qna/${qna.code}`} className="hover:text-blue-600 hover:underline">
                                                {qna.title}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-600">{qna.userName}</td>
                                        <td className="px-4 py-3 text-center text-gray-500">{qna.viewCount}</td>
                                        <td className="px-4 py-3 text-center text-gray-500">{qna.createdAt}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && totalPages > 0 && (
                    <div className="flex justify-center items-center p-4 space-x-2 border-t border-gray-200">
                        <button 
                            onClick={() => handlePageChange(page - 1)} 
                            disabled={page === 0}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                page === 0 
                                ? "text-gray-400 bg-gray-50 cursor-not-allowed" 
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                            이전
                        </button>
                        
                        <div className="flex space-x-1">
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handlePageChange(idx)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition ${
                                        page === idx 
                                        ? "bg-blue-600 text-white border-blue-600" 
                                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => handlePageChange(page + 1)} 
                            disabled={page >= totalPages - 1}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                page >= totalPages - 1 
                                ? "text-gray-400 bg-gray-50 cursor-not-allowed" 
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QnA;