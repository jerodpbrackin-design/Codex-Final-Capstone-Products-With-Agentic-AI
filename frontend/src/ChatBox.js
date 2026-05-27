import React, { useEffect, useRef, useState } from 'react';
import styles from './styles';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const [arcadeUrl, setArcadeUrl] = useState(null);
  const [arcadeLoading, setArcadeLoading] = useState(false);

  const containerRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setArcadeUrl(null);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;

    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    document.body.style.overflow = arcadeUrl ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [arcadeUrl]);

  const parseN8nStream = (rawText) => {
    // Try normal JSON first
    try {
      const parsed = JSON.parse(rawText);

      if (parsed.content) {
        return parsed.content;
      }

      if (parsed.reply) {
        return JSON.stringify(parsed.reply, null, 2);
      }
    } catch (err) {
      // not normal json
    }

    // Fallback for streamed n8n responses
    const lines = rawText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

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
    const lower = currentInput.toLowerCase();

    const easterEggs = {
      'duck hunt': 'https://www.retrogames.cc/embed/41462-duck-hunt.html',

      tron: 'https://www.retrogames.cc/embed/42833-tron-deadly-discs.html',

      'the legend of zelda': 'https://www.retrogames.cc/embed/41465-the-legend-of-zelda.html'
    };

    for (const key in easterEggs) {
      if (lower.includes(key)) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'user',
            text: currentInput,
          },
          {
            role: 'assistant',
            text: `🎮 INITIALIZING ${key.toUpperCase()} ARCADE MODULE...`,
          },
        ]);

        setInput('');

        setArcadeLoading(true);

        setTimeout(() => {
          setArcadeUrl(easterEggs[key]);
        }, 600);

        return;
      }
    }

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: currentInput,
      },
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
          chatInput: currentInput,
        }),
      });

      const rawText = await res.text();

      const cleanText = parseN8nStream(rawText) || 'No response';

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
        <div className="chat-header" style={styles.chatHeader}>
          💬 AI Inventory Assistant
        </div>

        <div id="chatWindow" className="chat-window" ref={containerRef}>
          {messages.length === 0 && (
            <div className="chat-empty">
              Ask something like:
              <br />
              "list products"
              <br />
              "low stock items"
              <br />
              "tron"
              <br />
              "duck hunt"
              <br />
              "zelda"
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`message-row ${m.role}`}>
              <div className={`message-bubble ${m.role}`}>{m.text}</div>
            </div>
          ))}
        </div>

        <div className="chat-input-bar">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask inventory AI..."
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={sending}
          />

          <button onClick={sendMessage} disabled={!input.trim() || sending}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      {(arcadeUrl || arcadeLoading) && (
        <div
          style={{
            position: 'fixed',
            inset: 0,

            background:
              'repeating-linear-gradient(to bottom, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 2px, transparent 4px), rgba(0,0,0,0.97)',

            zIndex: 99999,

            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',

            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => {
              setArcadeUrl(null);
              setArcadeLoading(false);
            }}
            style={{
              marginBottom: '18px',

              padding: '12px 22px',

              fontSize: '16px',

              cursor: 'pointer',

              background: '#000',

              color: 'cyan',

              border: '2px solid cyan',

              borderRadius: '8px',

              fontWeight: 'bold',

              boxShadow: '0 0 18px cyan',
            }}
          >
            EXIT ARCADE
          </button>

          {arcadeLoading && (
            <div
              style={{
                color: 'cyan',

                fontSize: '26px',

                marginBottom: '24px',

                fontFamily: 'monospace',

                textShadow: '0 0 8px cyan, 0 0 18px cyan',

                letterSpacing: '2px',
              }}
            >
              INITIALIZING ARCADE SYSTEM...
            </div>
          )}

          {arcadeUrl && (
            <div
              style={{
                padding: '14px',

                borderRadius: '18px',

                background: 'linear-gradient(135deg, #0f172a, #020617)',

                boxShadow: '0 0 40px rgba(0,255,255,0.35)',
              }}
            >
              <iframe
                title="Retro Arcade"
                src={arcadeUrl}
                width="90%"
                height="80%"
                allowFullScreen
                allow="autoplay; fullscreen; gamepad"
                onLoad={() => setArcadeLoading(false)}
                style={{
                  width: '1000px',
                  maxWidth: '92vw',

                  height: '700px',
                  maxHeight: '82vh',

                  border: '4px solid cyan',

                  boxShadow:
                    '0 0 10px cyan, 0 0 20px cyan, 0 0 40px rgba(0,255,255,0.6)',

                  borderRadius: '12px',

                  background: '#000',

                  imageRendering: 'pixelated',
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatBox;
