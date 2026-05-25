import React, { useState, useEffect, useRef } from 'react';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const parseN8nStream = (rawText) => {
    const lines = rawText.split('\n');
    let output = '';

    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        if (json.type === 'item' && json.content) {
          output += json.content;
        }
      } catch (error) {
        console.error('Error parsing N8n stream:', error);
      }
    }

    return output;
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const currentInput = input;
    setMessages((prev) => [...prev, { role: 'user', text: currentInput }]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });

      if (res.ok) {
        const data = await res.text();
        setMessages((prev) => [...prev, { role: 'assistant', text: parseN8nStream(data) }]);
        setSending(false);
      } else {
        console.error('Failed to send message');
        setSending(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSending(false);
    }
  };

  return (
    <div className="ChatBox">
      <div ref={containerRef} className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={sending}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} disabled={sending}>
        Send
      </button>
    </div>
  );
}

export default ChatBox;
