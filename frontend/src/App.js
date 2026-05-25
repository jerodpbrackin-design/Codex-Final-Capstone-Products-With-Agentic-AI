import { useEffect, useRef, useState } from "react";

export default function App() {
  const audioRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio("/tron.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    return () => {
      audioRef.current.pause();
    };
  }, []);

  const startMusic = async () => {
    try {
      await audioRef.current.play();
      setStarted(true);
    } catch (err) {
      console.error("Playback failed:", err);
    }
  };

  useEffect(() => {
    const startAudio = async () => {
      try {
        await audioRef.current.play();
        window.removeEventListener("click", startAudio);
      } catch (err) {
        console.error(err);
      }
    };

    window.addEventListener("click", startAudio);

    return () => {
      window.removeEventListener("click", startAudio);
    };
  }, []);

  const handleLinkClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="app">
      {!started && (
        <button onClick={startMusic}>
          Enter Grid
        </button>
      )}

      <h1>TRON App</h1>

      {/* Example link */}
      <a href="#" onClick={(e) => { e.preventDefault(); handleLinkClick('https://www.spotify.com'); }}>Visit Spotify</a>
    </div>
  );
}
