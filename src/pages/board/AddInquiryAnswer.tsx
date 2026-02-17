import { useState } from "react";
import type { UpsertInquiryAnswerRequest } from "../../types/request/upsertInquiryAnswerRequest";
import { answerInquiry } from "../../api/adminApi";

interface Props {
    inquiryCode: string;
    setIsEditing: (edit: boolean) => void;
}

function AddInquiryAnswer({ inquiryCode, setIsEditing }: Props) {

    const [content, setContent] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 

        const answerData: UpsertInquiryAnswerRequest = {
            detailCode: null,
            content: content
        }

        try {
            await answerInquiry(inquiryCode, answerData);
            alert('등록되었습니다.');
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            alert('등록 실패');
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>답변 작성</p>
                <textarea 
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="답변을 입력하세요"
                />
                <br />
                <button type="submit">저장</button>
                <button type="button" onClick={() => setIsEditing(false)}>취소</button>
            </form>
        </div>
    );
}

export default AddInquiryAnswer;