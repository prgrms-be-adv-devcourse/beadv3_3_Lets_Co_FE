import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteNotice, updateNotice } from "../../api/adminApi"; 
import { getNoticeDetails } from "../../api/noticeApi";
import type { noticeDetailsResponse } from "../../types/response/noticeDetailsResponse";
import type { UpsertNoticeRequest } from "../../types/request/upsertNoticeRequest";
import { useAuth } from "../../context/AuthContext";

import { BOARD_CATEGORY_OPTIONS } from "../../types/boardCategory";
import { BOARD_STATUS_OPTIONS } from "../../types/boardStatus";

function NoticeDetails() {
    const { noticeCode } = useParams<{ noticeCode: string }>();
    const { userRole } = useAuth();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [notice, setNotice] = useState<noticeDetailsResponse | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [editFormData, setEditFormData] = useState<UpsertNoticeRequest>({
        title: "",
        category: BOARD_CATEGORY_OPTIONS[0]?.value || "",
        status: BOARD_STATUS_OPTIONS[0]?.value || "",
        content: "",
        isPrivate: false,
        isPinned: false,
        publishedAt: new Date().toISOString()
    });

    const fetchNotice = async (code: string) => { 
        try {
            setLoading(true);
            const data = await getNoticeDetails(code);
            setNotice(data);
        } catch (error) {
            console.error(error);
            navigate(-1);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (noticeCode) {
            fetchNotice(noticeCode);
        }
    }, [noticeCode]);

    const startEditing = () => {
        if (!notice) return;

        setEditFormData({
            title: notice.title,
            category: notice.category,
            content: notice.content,
            status: (notice as any).status || BOARD_STATUS_OPTIONS[0]?.value,
            isPrivate: (notice as any).isPrivate || false,
            isPinned: (notice as any).isPinned || false,
            publishedAt: (notice as any).publishedAt || new Date().toISOString(),
        });
        setIsEditing(true);
    };

    const cancelEditing = () => {
        if (window.confirm("수정을 취소하시겠습니까? 변경사항이 사라집니다.")) {
            setIsEditing(false);
        }
    };

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setEditFormData({ ...editFormData, [name]: checked });
    };

    const handleUpdate = async () => {
        if (!noticeCode) return;

        if (!editFormData.title || !editFormData.content) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        try {
            await updateNotice(noticeCode, editFormData);
            alert("공지가 수정되었습니다.");
            setIsEditing(false);
            fetchNotice(noticeCode);
        } catch (error) {
            console.error(error);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async () => {
        if (!noticeCode) return;
        
        if (window.confirm("정말로 이 공지를 삭제하시겠습니까?")) {
            try {
                await deleteNotice(noticeCode);
                alert("삭제되었습니다.");
                navigate('/board/notice');
            } catch (error) {
                console.error(error);
                alert("삭제 실패");
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
            공지사항을 불러오는 중입니다...
        </div>
    );
    
    if (!notice) return (
        <div className="flex justify-center items-center h-64 text-gray-500 font-medium">
            데이터가 없습니다.
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEditing ? "공지 수정" : "공지사항 상세"}
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                    {isEditing ? "등록된 공지사항의 내용을 수정합니다." : "공지사항의 상세 내용을 확인합니다."}
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
                {!isEditing ? (
                    /* ---------------- 보기 모드 ---------------- */
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{notice.title}</h2>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                                    {notice.category}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-400">조회수</span>
                                    <span>{notice.viewCount}</span>
                                </div>
                                <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
                                    <span className="font-semibold text-gray-400">등록일</span>
                                    <span>{notice.updatedAt}</span>
                                </div>
                            </div>
                        </div>
                        
                        <hr className="border-gray-200 mb-6" />
                        
                        {/* 본문 내용 */}
                        <div className="min-h-[250px] text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
                            {notice.content}
                        </div>
                        
                        {/* 하단 버튼 영역 */}
                        <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-100">
                            <button 
                                onClick={() => navigate('/board/notice')}
                                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                목록으로
                            </button>

                            {/* 관리자(ADMIN)일 경우에만 수정/삭제 버튼 표시 */}
                            {userRole === "ADMIN" && (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleDelete}
                                        className="px-5 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors shadow-sm"
                                    >
                                        삭제
                                    </button>
                                    <button 
                                        onClick={startEditing}
                                        className="px-5 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm"
                                    >
                                        수정하기
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* ---------------- 수정 모드 ---------------- */
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">카테고리</label>
                                <select 
                                    name="category" 
                                    value={editFormData.category} 
                                    onChange={handleInputChange}
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
                                    name="status" 
                                    value={editFormData.status} 
                                    onChange={handleInputChange}
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
                                name="title"
                                value={editFormData.title} 
                                onChange={handleInputChange} 
                                placeholder="제목을 입력하세요"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* 체크박스 옵션 */}
                        <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                                <input 
                                    type="checkbox" 
                                    name="isPrivate" 
                                    checked={editFormData.isPrivate} 
                                    onChange={handleCheckboxChange} 
                                    className="w-4 h-4 text-gray-800 bg-white border-gray-300 rounded focus:ring-gray-800 cursor-pointer"
                                />
                                비공개
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                                <input 
                                    type="checkbox" 
                                    name="isPinned" 
                                    checked={editFormData.isPinned} 
                                    onChange={handleCheckboxChange} 
                                    className="w-4 h-4 text-gray-800 bg-white border-gray-300 rounded focus:ring-gray-800 cursor-pointer"
                                />
                                상단 고정
                            </label>
                        </div>

                        {/* 내용 입력 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">내용</label>
                            <textarea 
                                name="content"
                                rows={12}
                                value={editFormData.content} 
                                onChange={handleInputChange}
                                placeholder="내용을 입력하세요"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all resize-y"
                            />
                        </div>

                        {/* 하단 버튼 영역 */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
                            <button 
                                onClick={cancelEditing}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                취소
                            </button>
                            <button 
                                onClick={handleUpdate}
                                className="px-6 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm"
                            >
                                수정 완료
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NoticeDetails;