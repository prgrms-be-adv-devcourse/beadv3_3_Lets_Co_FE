import { useState } from "react";
import Inquiry from "./Inquiry";
import Notice from "./Notice";

function Board() {
    const [activeTab, setActiveTab] = useState<'notice' | 'inquiry'>('notice');

    return (
        <div className="max-w-5xl mx-auto">
            
            {/* 상단 탭 네비게이션 영역 */}
            <div className="flex gap-8 mb-8 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('notice')}
                    className={`pb-4 px-2 text-lg font-bold transition-all border-b-4 ${
                        activeTab === 'notice' 
                        ? 'border-gray-800 text-gray-800' 
                        : 'border-transparent text-gray-400 hover:text-gray-600' 
                    }`}
                >
                    공지사항
                </button>
                <button
                    onClick={() => setActiveTab('inquiry')}
                    className={`pb-4 px-2 text-lg font-bold transition-all border-b-4 ${
                        activeTab === 'inquiry' 
                        ? 'border-gray-800 text-gray-800'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                    문의 게시판
                </button>
            </div>

            {/* 선택된 탭에 따라 컴포넌트 조건부 렌더링 */}
            <div className="mt-4 animate-fadeIn">
                {activeTab === 'notice' ? <Notice /> : <Inquiry />}
            </div>

        </div>
    );
}

export default Board;