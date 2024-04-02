import React, { useState, useEffect, useRef } from 'react';
import musicFile from './music.mp3';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

const BackgroundMusic: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(new Audio(musicFile));

  useEffect(() => {
    // Configure the audio element for looping
    audioRef.current.loop = true;

    // Attempt to play music automatically when the component mounts
    const playAudio = async () => {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Error playing music:', error);
        // Handle the case where the browser prevents auto-play
      }
    };
    
    playAudio();

    // Listen to the 'isMuted' state to mute or unmute the music
    audioRef.current.volume = isMuted ? 0 : 1;

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, [isMuted]);

  return (
    <button 
      onClick={() => setIsMuted(!isMuted)} 
      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      aria-label="Mute music"
    >
      <VolumeOffIcon />
    </button>
  );
};

export default BackgroundMusic;
