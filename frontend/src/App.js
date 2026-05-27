import React, { useEffect, useRef, useState } from 'react';
import './cyberpunk.css';

import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import ChatBox from './ChatBox';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Start muted for browser compatibility
  const [muted, setMuted] = useState(true);

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 1;
    }
  }, []);

  // Unlock media playback after first interaction
  useEffect(() => {
    const unlockAudio = async () => {
      if (!videoRef.current) return;

      try {
        await videoRef.current.play();
      } catch (err) {
        console.error('Autoplay unlock failed:', err);
      }

      window.removeEventListener('click', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);

    return () => {
      window.removeEventListener('click', unlockAudio);
    };
  }, []);

  const toggleMute = async () => {
    if (!videoRef.current) return;

    try {
      if (videoRef.current.muted) {
        videoRef.current.muted = false;

        await videoRef.current.play();

        setMuted(false);
      } else {
        videoRef.current.muted = true;

        setMuted(true);
      }
    } catch (err) {
      console.error('Audio unlock failed:', err);
    }
  };

  return (
    <div className="App">
      <h1>Inventory Dashboard</h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <button onClick={toggleMute}>
          {muted ? 'UNMUTE' : 'MUTE'}
        </button>
      </div>

      {/* Hidden cyberpunk ambient feed */}
      <div
        style={{
          position: 'fixed',
          left: '-9999px',
          top: '-9999px',

          width: '320px',
          height: '180px',

          overflow: 'hidden',

          pointerEvents: 'none',
        }}
      >
        <video
          ref={videoRef}
          width="320"
          height="180"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          preload="auto"
          style={{
            border: '2px solid #00ffff',
            boxShadow: '0 0 20px #00ffff',
            borderRadius: '8px',
            background: '#000',
          }}
          onCanPlay={() => {
            console.log('Video ready');
          }}
          onError={(e) => {
            console.error('Video error', e);
          }}
        >
          {/* Flask static video */}
          <source src="/static/forked.mp4" type="video/mp4" />
        </video>
      </div>

      <ProductForm onProductAdded={() => setRefreshKey((prev) => prev + 1)} />

      <ProductTable refreshKey={refreshKey} />

      <ChatBox />
    </div>
  );
}

export default App;
