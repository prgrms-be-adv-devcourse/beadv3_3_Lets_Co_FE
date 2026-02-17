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
        <div>
            <h1>공지 작성</h1>

            <form onSubmit={handleSubmit}>
                
                <div>
                    <div>
                        <label>카테고리</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {BOARD_CATEGORY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>상태</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                    />
                </div>

                <div>
                    <label>
                        <input 
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setPrivate(e.target.checked)}
                        />
                        비공개
                    </label>

                    <label>
                        <input 
                            type="checkbox"
                            checked={isPinned}
                            onChange={(e) => setPin(e.target.checked)}
                        />
                        상단 고정
                    </label>
                </div>

                <div>
                    <p>내용</p>
                    <textarea 
                        rows={10}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                    />
                </div>

                <div>
                    <button type="submit">
                        등록하기
                    </button>
                    <button type="button" onClick={() => navigate(-1)}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddNotice;