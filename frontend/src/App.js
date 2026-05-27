import React, { useEffect, useRef, useState } from 'react';
import './cyberpunk.css';

import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import ChatBox from './ChatBox';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [muted, setMuted] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 1;
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
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
          {muted ? 'UNMUTE FEED' : 'MUTE FEED'}
        </button>
      </div>

      <div
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <video
          ref={videoRef}
          width="700"
          autoPlay
          loop
          controls={false}
          style={{
            border: '2px solid #00ffff',
            boxShadow: '0 0 20px #00ffff',
            borderRadius: '8px',
          }}
        >
          <source src="/forked.mp4" type="video/mp4" />
        </video>
      </div>

      <ProductForm onProductAdded={() => setRefreshKey((prev) => prev + 1)} />

      <ProductTable refreshKey={refreshKey} />

      <ChatBox />
    </div>
  );
}

export default App;
