import React, { useState, useEffect, useRef } from 'react';
import musicFile from './music.mp3';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp'; // Import the VolumeUp icon

const BackgroundMusic: React.FC = () => {
  // Set the initial state to true to start muted
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(new Audio(musicFile));

  useEffect(() => {
    audioRef.current.loop = true;

    const playAudio = async () => {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Error playing music:', error);
      }
    };

    playAudio();
    // Set volume to 0.5 when not muted, ensuring it plays at 50% volume
    audioRef.current.volume = isMuted ? 0 : 0.5;

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, [isMuted]);

  return (
    <button 
      onClick={() => setIsMuted(!isMuted)} 
      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      aria-label={isMuted ? "Unmute music" : "Mute music"}
    >
      {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
    </button>
  );
};

export default BackgroundMusic;
