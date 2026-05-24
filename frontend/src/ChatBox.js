import React, { useEffect, useRef, useState } from 'react';
import styles from './styles';

const API_URL = process.env.REACT_APP_API_URL || 'https://jrod7.app.n8n.cloud/webhook/1c29803a-be0e-4edc-8b5c-6da9de4fc5fb';

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
      } catch (e) {
        console.error('Error parsing line:', e);
      }
    }

    return output.trim();
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
        body: JSON.stringify({ chatInput: currentInput }),
      });

      const rawText = await res.text();
      const cleanText = parseN8nStream(rawText) || 'No response';
      const safeText = cleanText.length > 10000 ? cleanText.slice(0, 10000) + '…' : cleanText;

      setMessages((prev) => [...prev, { role: 'bot', text: safeText }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'bot', text: 'Error: failed to get response' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.chatCard}>
        <div style={styles.header}>💬 AI Inventory Assistant</div>

        <div id="chatWindow" ref={containerRef} style={styles.chatWindow}>
          {messages.length === 0 && (
            <div style={styles.emptyState}>
              Ask something like “list products” or “how many low stock?”
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.messageRow,
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  backgroundColor: m.role === 'user' ? styles.tokens.primary : '#f3f4f6',
                  color: m.role === 'user' ? '#fff' : '#111827',
                  border: m.role === 'user' ? 'none' : '1px solid #eef2f6',
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.inputBar}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something like 'list products'..."
            style={styles.chatInput || styles.input}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            aria-label="Message"
          />

          <button
            onClick={sendMessage}
            style={{
              ...(styles.chatButton || styles.button),
              opacity: !input.trim() || sending ? 0.6 : 1,
              cursor: !input.trim() || sending ? 'not-allowed' : 'pointer',
            }}
            disabled={!input.trim() || sending}
          >
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
