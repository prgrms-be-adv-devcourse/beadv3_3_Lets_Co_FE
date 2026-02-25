import { useState } from "react";
import type { FormEvent } from "react";
import { manualSettlement } from "../../api/settlementApi";

function ManualSettlement() {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        // 중요 작업이므로 진행 여부를 한 번 더 확인
        if (!window.confirm("수동 정산을 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            return;
        }
        
        try {
            setIsProcessing(true);
            const response = await manualSettlement();
            console.log(response.data);

            alert("정산이 완료되었습니다.");
        } catch (error) {
            alert("정산 처리에 실패했습니다.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* 페이지 타이틀 영역 */}
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">수동 정산 처리</h1>
                <p className="text-sm text-gray-500 mt-2">
                    관리자(Admin) 전용 기능입니다. 현재까지의 거래 내역을 바탕으로 즉시 정산을 실행합니다.
                </p>
            </div>

            {/* 메인 정산 카드 */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-10 flex flex-col items-center justify-center text-center mt-4">
                
                {/* 시각적 아이콘 및 설명 */}
                <div className="mb-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <span className="text-2xl" role="img" aria-label="정산">💳</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2">일괄 정산 시스템</h2>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                        아래 버튼을 클릭하면 아직 정산되지 않은 모든 내역이 일괄 처리됩니다. 시스템 부하에 따라 시간이 조금 걸릴 수 있습니다.
                    </p>
                </div>

                {/* 정산 폼 (버튼) */}
                <form onSubmit={handleSubmit} className="w-full sm:w-auto">
                    <button 
                        type="submit"
                        disabled={isProcessing}
                        className="w-full sm:w-auto bg-gray-800 hover:bg-gray-900 text-white text-base font-semibold py-3 px-10 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                정산 처리 중...
                            </>
                        ) : (
                            "수동 정산 실행"
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default ManualSettlement;