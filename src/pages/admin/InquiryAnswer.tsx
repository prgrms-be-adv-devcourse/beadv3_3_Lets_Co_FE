interface Props {
    answer: any; 
    onEdit?: () => void;
}

function InquiryAnswer({ answer, onEdit }: Props) {
    return (
        <div className="flex flex-col gap-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>관리자 답변</span>
                {answer && <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md font-medium">답변완료</span>}
            </h3>
            
            {!answer ? (
                // 답변이 없을 경우
                <div className="flex flex-col items-center justify-center py-8 gap-4 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
                    <p className="text-gray-500 font-medium">아직 답변이 등록되지 않았습니다.</p>
                    
                    {/* 관리자(onEdit이 존재함)일 경우에만 등록 버튼 노출 */}
                    {onEdit && (
                        <button 
                            onClick={onEdit}
                            className="px-5 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm"
                        >
                            답변 등록하기
                        </button>
                    )}
                </div>
            ) : (
                // 답변이 있을 경우
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
                        {answer.content}
                    </p>
                    
                    {/* 관리자(onEdit이 존재함)일 경우에만 수정 버튼 노출 */}
                    {onEdit && (
                        <div className="flex justify-end border-t border-gray-100 pt-3 mt-2">
                            <button 
                                onClick={onEdit}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                답변 수정하기
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default InquiryAnswer;