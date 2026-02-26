import { useState } from "react";
import { active } from "../../api/assistant";
import Assistant from "./Assistant";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = async () => {
    if (!isOpen) {
      try {
        await active();
      } catch (error) {
        console.error("챗봇 기능 활성화 실패", error);
        alert("챗봇 기능 활성화에 실패했습니다. 잠시 후 시도해주세요.");
        return; 
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* 챗봇 창 (열렸을 때만 표시) */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up">
          <Assistant onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* 우측 하단 플로팅 버튼 */}
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all duration-200 focus:outline-none"
      >
        {isOpen ? (
          // 닫기 아이콘 (X)
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // 채팅 아이콘
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default ChatWidget;