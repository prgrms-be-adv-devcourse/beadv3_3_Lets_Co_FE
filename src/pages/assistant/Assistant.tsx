import { useState, type FormEvent } from "react";
import ChatList from "./ChatList";
import { ask } from "../../api/assistant";
import type { AssistantProductsResponse } from "../../types/response/assistantResponse copy";

export type MessageType = {
  role: "user" | "bot";
  content: string; 
  data?: AssistantProductsResponse[];
  isLoading?: boolean;
};

function Assistant() {
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
    <div>
      <h1>챗 봇</h1>

      <ChatList messages={messages} />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
        />
        <button type="submit" disabled={messages[messages.length - 1]?.isLoading}>
          제출
        </button>
      </form>
    </div>
  );
}

export default Assistant;