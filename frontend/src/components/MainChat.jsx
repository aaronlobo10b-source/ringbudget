import { useState } from "react";

function MainChat() {

    const [message, setMessage] = useState("");

    const [reply, setReply] = useState("");

    const [loading, setLoading] = useState(false);

    async function sendMessage() {

        if (!message.trim()) {

            return;

        }

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

            const data = await response.json();

            setReply(data.reply);

        }

        catch (error) {

            console.error(error);

            setReply("Unable to contact the AI assistant.");

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="chat-container">

            <h2>AI Budget Coach</h2>

            <textarea

                rows="4"

                placeholder="Example: I spent ₹250 on lunch."

                value={message}

                onChange={(e) => setMessage(e.target.value)}

            />

            <button

                onClick={sendMessage}

                disabled={loading}

            >

                {loading ? "Thinking..." : "Send"}

            </button>

            {reply && (

                <div className="chat-reply">

                    <h3>Gemini</h3>

                    <p>{reply}</p>

                </div>

            )}

        </div>

    );

}

export default MainChat;