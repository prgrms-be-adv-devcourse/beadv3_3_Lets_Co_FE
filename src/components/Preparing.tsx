import { useNavigate } from "react-router-dom";

function Preparing() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
                
                {/* 톱니바퀴 아이콘 */}
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 animate-[spin_3s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                </div>

                {/* 텍스트 영역 */}
                <h2 className="text-2xl font-bold text-gray-800 mb-3">페이지 준비중입니다</h2>
                <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                    더 나은 서비스를 제공하기 위해<br />
                    해당 기능을 열심히 준비하고 있습니다.<br />
                    조금만 기다려주세요!
                </p>

                {/* 버튼 영역 */}
                <div className="flex gap-3 justify-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                        이전으로
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        홈으로 가기
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Preparing;