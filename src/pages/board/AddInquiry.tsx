import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { UpsertInquiryRequest } from "../../types/request/upsertInquiryRequest";
import { addInquiry } from "../../api/inquiryApi";
import { BOARD_CATEGORY_OPTIONS } from "../../types/boardCategory";
import { BOARD_STATUS_OPTIONS } from "../../types/boardStatus";

function AddInquiry() {
    const navigate = useNavigate();

    const [category, setCategory] = useState(BOARD_CATEGORY_OPTIONS[0].value);
    const [status, setStatus] = useState(BOARD_STATUS_OPTIONS[0].value);
    const [title, setTitle] = useState('');
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!title || !content || !name) {
            alert("제목, 이름, 내용은 필수입니다.");
            return;
        }

        const addData: UpsertInquiryRequest = {
            detailCode: "",
            category: category,
            // status: status,
            title: title,
            name: name,
            content: content,
            isPrivate: isPrivate,
        };

        try {
            await addInquiry(addData);
            alert("문의가 등록되었습니다.");
            navigate('/board/inquiry');
        } catch (error) {
            console.error(error);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <h1>문의 작성</h1>

            <form onSubmit={handleSubmit}>
                
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

                <div>
                    <label>작성자</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="이름"
                    />
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
                            onChange={(e) => setIsPrivate(e.target.checked)}
                        />
                        비공개
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

export default AddInquiry;