import type { MessageType } from "./assistant";

type ChatListProps = {
  messages: MessageType[];
};

function ChatList({ messages }: ChatListProps) {
  return (
    <div>
      {messages.map((msg, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <strong>{msg.role === "user" ? "나: " : "챗봇: "}</strong>
          
          {msg.isLoading ? (
            <span>답변을 기다리는 중입니다...</span>
          ) : (
            <div>
              <p style={{ whiteSpace: "pre-wrap" }}>{msg.content}</p>
              
              {msg.role === "bot" && msg.data && msg.data.length > 0 && (
                <ul>
                  {msg.data.map((product, pIndex) => (
                    <li key={pIndex}>
                      <a href={product.Link} target="_blank" rel="noreferrer">
                        {product.Products_Name}
                      </a>
                      {" "} - {product.Sale_Price.toLocaleString()}원 
                      (정가: {product.Price.toLocaleString()}원)
                      <br />
                      <small>{product.Description}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChatList;