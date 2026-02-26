import { useState, type FormEvent } from "react";
import ChatList from "./ChatList";
import { ask } from "../../api/assistant";
import type { AssistantProductsResponse } from "../../types/response/assistantResponse";

export type MessageType = {
  role: "user" | "bot";
  content: string; 
  data?: AssistantProductsResponse[];
  isLoading?: boolean;
};

function Assistant({ onClose }: { onClose?: () => void }) {
  const [userQuestion, setUserQuestion] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    const currentQuestion = userQuestion;
    setUserQuestion(""); 

    setMessages((prev) => [
      ...prev,
      { role: "user", content: currentQuestion },
      { role: "bot", content: "로딩 중...", isLoading: true },
    ]);

    try {
      const response = await ask(currentQuestion);

      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          role: "bot",
          content: response.data.answer,
          data: response.data.data,
          isLoading: false,
        };
        return updatedMessages;
      });
      
    } catch (error) {
      console.error("문제 발생", error);
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          role: "bot",
          content: "챗봇에 기능 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
          isLoading: false,
        };
        return updatedMessages;
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 헤더 영역 */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-sm">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          AI 어시스턴트
        </h2>
        {onClose && (
          <button onClick={onClose} className="hover:text-gray-200 transition-colors">
            ✕
          </button>
        )}
      </div>

      {/* 채팅 메시지 목록 영역 (스크롤) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            무엇이든 물어보세요!
          </div>
        ) : (
          <ChatList messages={messages} />
        )}
      </div>

      {/* 메시지 입력 영역 */}
      <form onSubmit={handleSubmit} className="p-3 bg-gray-100 border-t border-gray-200 flex gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="메시지를 입력하세요..."
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={messages[messages.length - 1]?.isLoading || !userQuestion.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
        >
          전송
        </button>
      </form>
    </div>
  );
}

export default Assistant;