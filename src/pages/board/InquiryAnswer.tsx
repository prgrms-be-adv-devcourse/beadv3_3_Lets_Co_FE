interface Props {
    answer: any; // 백엔드 타입이 확정되면 구체적인 타입으로 변경 (예: InquiryAnswerResponse)
    onEdit: () => void;
}

function InquiryAnswer({ answer, onEdit }: Props) {
    return (
        <div>
            <h3>관리자 답변</h3>
            
            {!answer ? (
                // 답변이 없을 경우
                <div>
                    <p>답변이 등록되지 않았습니다.</p>
                    <button onClick={onEdit}>답변 등록</button>
                </div>
            ) : (
                // 답변이 있을 경우
                <div>
                    <p>{answer.content}</p>
                    <br />
                    <button onClick={onEdit}>답변 수정하기</button>
                </div>
            )}
        </div>
    );
}

export default InquiryAnswer;