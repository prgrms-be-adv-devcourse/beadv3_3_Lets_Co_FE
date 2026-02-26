import type { MessageType } from "./Assistant";

type ChatListProps = {
  messages: MessageType[];
};

function ChatList({ messages }: ChatListProps) {
  return (
    <div className="flex flex-col space-y-4">
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";

        return (
          <div
            key={index}
            className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 text-sm shadow-sm ${
                isUser
                  ? "bg-blue-600 text-white rounded-2xl rounded-br-none"
                  : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-none"
              }`}
            >
              {msg.isLoading ? (
                // 로딩 애니메이션 (점 3개 깜빡임)
                <div className="flex space-x-1.5 items-center h-5 py-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {/* 일반 메시지 텍스트 */}
                  <p className="whitespace-pre-wrap leading-relaxed break-words">
                    {msg.content}
                  </p>

                  {/* 챗봇이 보내준 상품 리스트 데이터가 있는 경우 */}
                  {msg.role === "bot" && msg.data && msg.data.length > 0 && (
                    <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-100">
                      {msg.data.map((product, pIndex) => (
                        <div 
                          key={pIndex} 
                          className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-400 transition-colors"
                        >
                          <a 
                            href={product.Link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-blue-700 font-semibold text-sm hover:underline line-clamp-2"
                          >
                            {product.Products_Name}
                          </a>
                          <div className="mt-1.5 flex items-end gap-2">
                            <span className="text-gray-900 font-bold text-base">
                              {product.Price.toLocaleString()}원
                            </span>
                          </div>
                          {product.Description && (
                            <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 leading-snug">
                              {product.Description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatList;