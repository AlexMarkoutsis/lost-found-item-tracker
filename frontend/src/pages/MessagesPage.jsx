import {useState, useEffect, useContext, useRef} from "react";
import {AuthContext} from "../context/AuthContext";
import {ACCESS_TOKEN} from "../constants";

export default function MessagesPage() {
  const {user} = useContext(AuthContext);

  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const threadRef = useRef(null);

  // Auto-scroll when messages change
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  // Load inbox list
  useEffect(() => {
    async function loadInbox() {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const res = await fetch("/api/messages/inbox/", {
          headers: {Authorization: `Bearer ${token}`},
        });
        const data = await res.json();

        const grouped = groupConversations(data, user.id).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setConversations(grouped);
      } catch (err) {
        console.error("Failed to load inbox:", err);
      }
    }

    loadInbox();
  }, [user]);

  // Load conversation when activeUser changes
  useEffect(() => {
    if (!activeUser) return;

    async function loadConversation() {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const res = await fetch(`/api/messages/${activeUser}/`, {
          headers: {Authorization: `Bearer ${token}`},
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to load conversation:", err);
      }
    }

    loadConversation();
  }, [activeUser]);

  // Group by user
  function groupConversations(messages, currentUserId) {
    const map = {};

    messages.forEach(msg => {
      const otherUserId =
        msg.sender === currentUserId ? msg.recipient : msg.sender;

      // Only store the most recent message per user
      if (!map[otherUserId]) {
        map[otherUserId] = msg;
      }
    });

    return Object.values(map);
  }


  // Send message
  async function handleSendMessage() {
    if (!newMessage.trim() || !activeUser) return;

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);

      await fetch("/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipient: activeUser,
          content: newMessage,
        }),
      });

      setNewMessage("");

      // Reload conversation
      const res = await fetch(`/api/messages/${activeUser}/`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }

  return (
    <div className="messages-container" style={{display: "flex", height: "100%"}}>

      {/* LEFT SIDEBAR */}
      <div className="messages-sidebar" style={{width: "30%", borderRight: "1px solid #ddd", padding: "1rem"}}>
        <h2>Messages</h2>

        {conversations.map((conv) => {
          const otherUserId =
            conv.sender === user.id ? conv.recipient : conv.sender;

          const otherUsername =
            conv.sender === user.id
              ? conv.recipient_username
              : conv.sender_username;

          return (
            <div
              key={otherUserId}
              onClick={() => setActiveUser(otherUserId)}
              style={{
                padding: "0.75rem",
                cursor: "pointer",
                background: activeUser === otherUserId ? "#eee" : "transparent",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <strong>{otherUsername}</strong>
              <div style={{fontSize: "0.9rem", color: "#666"}}>
                {conv.content.slice(0, 30)}...
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT PANEL */}
      <div className="messages-thread" style={{flex: 1, display: "flex", flexDirection: "column"}}>

        {!activeUser ? (
          <div style={{padding: "2rem", color: "#666"}}>
            Select a conversation to start messaging.
          </div>
        ) : (
          <>
            {/* MESSAGE LIST */}
            <div
              className="thread-messages"
              ref={threadRef}
              style={{flex: 1, overflowY: "auto", padding: "1rem"}}
            >
              {messages.map((msg) => {
                const isSender = msg.sender === user.id;

                return (
                  <div
                    key={msg.id}
                    style={{
                      maxWidth: "70%",
                      marginBottom: "1rem",
                      padding: "0.6rem 0.9rem",
                      borderRadius: "10px",
                      background: isSender ? "#d1e7ff" : "#f1f1f1",
                      marginLeft: isSender ? "auto" : "0",
                    }}
                  >
                    <div>{msg.content}</div>
                    <div style={{fontSize: "0.75rem", color: "#666", marginTop: "0.25rem"}}>
                      {new Date(msg.created_at).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* MESSAGE INPUT */}
            <div style={{display: "flex", padding: "1rem", borderTop: "1px solid #ddd"}}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{flex: 1, padding: "0.5rem"}}
              />
              <button onClick={handleSendMessage} style={{marginLeft: "0.5rem"}}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
