import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { UpsertNoticeRequest } from "../../types/request/upsertNoticeRequest";
import { BOARD_CATEGORY_OPTIONS } from "../../types/boardCategory";
import { BOARD_STATUS_OPTIONS } from "../../types/boardStatus";
import { addNotice } from "../../api/adminApi";

function AddNotice() {
    const navigate = useNavigate();

    const [category, setCategory] = useState(BOARD_CATEGORY_OPTIONS[0]?.value || '');
    const [status, setStatus] = useState(BOARD_STATUS_OPTIONS[0]?.value || '');
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPrivate, setPrivate] = useState(false);
    const [isPinned, setPin] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!title || !content) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        const addData: UpsertNoticeRequest = {
            category: category,
            status: status,
            title: title,
            content: content,
            isPrivate: isPrivate,
            isPinned: isPinned,
            publishedAt: new Date().toISOString(), 
        };

        try {
            await addNotice(addData);
            alert("공지가 등록되었습니다.");
            navigate('/board/notice');
        } catch (error) {
            console.error(error);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* 폼을 감싸는 메인 카드 컨테이너 */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mt-6">
                
                <div className="mb-6 border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">공지 작성</h1>
                    <p className="text-sm text-gray-500 mt-2">새로운 공지사항을 등록합니다.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    
                    {/* 카테고리 & 상태 (2단 그리드) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">카테고리</label>
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all cursor-pointer"
                            >
                                {BOARD_CATEGORY_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">상태</label>
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all cursor-pointer"
                            >
                                {BOARD_STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 제목 입력 */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">제목</label>
                        <input 
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* 체크박스 옵션 (비공개 / 상단 고정) */}
                    <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                            <input 
                                type="checkbox"
                                checked={isPrivate}
                                onChange={(e) => setPrivate(e.target.checked)}
                                className="w-4 h-4 text-gray-800 bg-white border-gray-300 rounded focus:ring-gray-800 cursor-pointer"
                            />
                            비공개
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                            <input 
                                type="checkbox"
                                checked={isPinned}
                                onChange={(e) => setPin(e.target.checked)}
                                className="w-4 h-4 text-gray-800 bg-white border-gray-300 rounded focus:ring-gray-800 cursor-pointer"
                            />
                            상단 고정
                        </label>
                    </div>

                    {/* 내용 입력 (Textarea) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">내용</label>
                        <textarea 
                            rows={12}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="공지사항 내용을 상세히 입력해주세요."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all resize-y"
                        />
                    </div>

                    {/* 하단 버튼 영역 */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            취소
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm"
                        >
                            등록하기
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default AddNotice;