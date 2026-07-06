import { useState } from "react";
import "../design.css";

function MainChat() {
    const [message, setMessage] = useState("");
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);
    const [messageHistory, setMessageHistory] = useState([]);

    async function sendMessage() {
        if (!message.trim()) {
            return;
        }

        // Add user message to history
        const newHistory = [...messageHistory, { role: "user", text: message }];
        setMessageHistory(newHistory);
        setMessage("");
        setLoading(true);
        setReply("");

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Unable to send message");
            }

            const data = await response.json();
            const assistantReply = data?.reply || "The assistant did not return a reply.";
            
            // Add assistant message to history
            setMessageHistory([
                ...newHistory,
                { role: "assistant", text: assistantReply }
            ]);
            setReply(assistantReply);
        } catch (error) {
            console.error(error);
            const errorMsg = "Unable to contact the AI assistant.";
            setMessageHistory([
                ...newHistory,
                { role: "assistant", text: errorMsg, isError: true }
            ]);
            setReply(errorMsg);
        } finally {
            setLoading(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            sendMessage();
        }
    };

    return (
        <div className="chat-container">
            <h2>🤖 AI Budget Coach</h2>
            <p style={{ color: "var(--text-tertiary)", fontSize: "0.9rem", marginBottom: "16px" }}>
                Ask questions about your spending, get smart advice, and track your goals
            </p>

            {/* Message History */}
            {messageHistory.length > 0 && (
                <div style={{ 
                    maxHeight: "200px", 
                    overflowY: "auto", 
                    marginBottom: "16px",
                    paddingRight: "8px"
                }}>
                    {messageHistory.map((msg, idx) => (
                        <div
                            key={idx}
                            style={{
                                marginBottom: "12px",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                background: msg.role === "user" 
                                    ? "rgba(102, 126, 234, 0.15)"
                                    : msg.isError 
                                    ? "rgba(248, 113, 113, 0.15)"
                                    : "rgba(52, 211, 153, 0.08)",
                                borderLeft: `3px solid ${
                                    msg.role === "user"
                                        ? "#667eea"
                                        : msg.isError
                                        ? "#f87171"
                                        : "#34d399"
                                }`,
                                fontSize: "0.85rem",
                                color: msg.role === "user" ? "var(--text-primary)" : "var(--text-secondary)"
                            }}
                        >
                            <strong style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                                {msg.role === "user" ? "You" : "Buddy"}
                            </strong>
                            <p style={{ marginTop: "4px", marginBottom: 0 }}>{msg.text}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Section */}
            <div className="chat-input-group">
                <textarea
                    rows="3"
                    placeholder="Example: I spent ₹250 on lunch. Should I cut back?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
                <button
                    className="chat-send-btn"
                    onClick={sendMessage}
                    disabled={loading || !message.trim()}
                >
                    {loading ? "Thinking..." : "Send"}
                </button>
            </div>

            {/* Current Reply */}
            {reply && (
                <div className="chat-reply">
                    <h3>💭 Buddy's Advice</h3>
                    <p>{reply}</p>
                </div>
            )}
        </div>
    );
}

export default MainChat;