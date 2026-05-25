import React, { useEffect, useRef, useState } from 'react';
import styles from './styles';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
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
        console.error('Error parsing stream:', error);
      }
    }

    return output.trim();
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const currentInput = input;

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: currentInput },
    ]);

    setInput('');
    setSending(true);

    try {
      const res = await fetch('/send-to-n8n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
        }),
      });

      const rawText = await res.text();

      const cleanText =
        parseN8nStream(rawText) || 'No response';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: cleanText,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Error: failed to get response',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-card">

        <div className="chat-header">
          💬 AI Inventory Assistant
        </div>

        <div
          id="chatWindow"
          className="chat-window"
          ref={containerRef}
        >
          {messages.length === 0 && (
            <div className="chat-empty">
              Ask something like:
              <br />
              "list products"
              <br />
              "low stock items"
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`message-row ${m.role}`}
            >
              <div
                className={`message-bubble ${m.role}`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input-bar">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask inventory AI..."
            onKeyDown={(e) =>
              e.key === 'Enter' && sendMessage()
            }
            disabled={sending}
          />

          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>

        </div>
      </div>
    </div>
  );
}

export default ChatBox;