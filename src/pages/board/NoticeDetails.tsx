import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteNotice, updateNotice } from "../../api/adminApi"; 
import { getNoticeDetails } from "../../api/noticeApi";
import type { noticeDetailsResponse } from "../../types/response/noticeDetailsResponse";
import type { UpsertNoticeRequest } from "../../types/request/upsertNoticeRequest";

import { BOARD_CATEGORY_OPTIONS } from "../../types/boardCategory";
import { BOARD_STATUS_OPTIONS } from "../../types/boardStatus";

function NoticeDetails() {
    
    const { noticeCode } = useParams<{ noticeCode: string }>();

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

    if (loading) return <div>로딩 중...</div>;
    if (!notice) return <div>데이터가 없습니다.</div>;

    return (
        <div>
            <h1>{isEditing ? "공지 수정" : "공지 상세"}</h1>

            {!isEditing ? (
                /* 보기 모드 */
                <div>
                    <div>
                        <label>제목: </label>
                        <strong>{notice.title}</strong>
                    </div>
                    <div>
                        <label>카테고리: </label>
                        <span>{notice.category}</span>
                    </div>
                    <div>
                        <label>조회수: </label>
                        <span>{notice.viewCount}</span>
                    </div>
                    <div>
                        <label>등록일: </label>
                        <span>{notice.updatedAt}</span>
                    </div>
                    
                    <hr />
                    
                    <div>
                        <label>내용</label>
                        <div>
                            {notice.content}
                        </div>
                    </div>
                    
                    <div>
                        <button onClick={startEditing}>수정</button>
                        <button onClick={handleDelete}>삭제</button>
                        <button onClick={() => navigate('/board/notice')}>목록</button>
                    </div>
                </div>
            ) : (
                /* 수정 모드 */
                <div>
                    <div>
                        <div>
                            <label>카테고리</label>
                            <select name="category" value={editFormData.category} onChange={handleInputChange}>
                                {BOARD_CATEGORY_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label>상태</label>
                            <select name="status" value={editFormData.status} onChange={handleInputChange}>
                                {BOARD_STATUS_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label>제목</label>
                        <input 
                            type="text"
                            name="title"
                            value={editFormData.title} 
                            onChange={handleInputChange} 
                            placeholder="제목을 입력하세요"
                        />
                    </div>

                    <div>
                        <label>
                            <input 
                                type="checkbox" 
                                name="isPrivate" 
                                checked={editFormData.isPrivate} 
                                onChange={handleCheckboxChange} 
                            />
                            비공개
                        </label>

                        <label>
                            <input 
                                type="checkbox" 
                                name="isPinned" 
                                checked={editFormData.isPinned} 
                                onChange={handleCheckboxChange} 
                            />
                            상단 고정
                        </label>
                    </div>

                    <div>
                        <p>내용</p>
                        <textarea 
                            name="content"
                            rows={10}
                            value={editFormData.content} 
                            onChange={handleInputChange}
                            placeholder="내용을 입력하세요"
                        />
                    </div>

                    <div>
                        <button onClick={handleUpdate}>수정 완료</button>
                        <button onClick={cancelEditing}>취소</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NoticeDetails;