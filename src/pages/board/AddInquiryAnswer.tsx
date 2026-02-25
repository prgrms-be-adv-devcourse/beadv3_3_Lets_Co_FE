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

        // 빈 내용 제출 방지
        if (!content.trim()) {
            alert("답변 내용을 입력해주세요.");
            return;
        }

        const answerData: UpsertInquiryAnswerRequest = {
            detailCode: null,
            content: content
        }

        try {
            // todo: 관리자 답변은 나중에
            await answerInquiry(inquiryCode, answerData);
            alert('답변이 등록되었습니다.');
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            alert('아직 준비중인 기능입니다.');
        }
    }

    return (
        <div className="w-full animate-fadeIn">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* 폼 헤더 */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <h3 className="text-lg font-bold text-gray-800">답변 작성</h3>
                    <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded-md">
                        관리자 전용
                    </span>
                </div>

                {/* 입력 창 */}
                <textarea 
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="문의에 대한 답변을 상세히 입력해주세요."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all resize-y"
                />
                
                {/* 하단 액션 버튼 */}
                <div className="flex justify-end gap-2 mt-2">
                    <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        취소
                    </button>
                    <button 
                        type="submit"
                        className="px-5 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm"
                    >
                        답변 등록 완료
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddInquiryAnswer;