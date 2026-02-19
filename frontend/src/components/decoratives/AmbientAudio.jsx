import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

const AmbientAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef(null);
  const previousVolume = useRef(0.3);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.loop = true;

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.log('Erreur lecture audio:', error);
      });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      // Désactiver le mute
      setIsMuted(false);
      setVolume(previousVolume.current);
      audio.volume = previousVolume.current;
    } else {
      // Activer le mute
      previousVolume.current = volume;
      setIsMuted(true);
      setVolume(0);
      audio.volume = 0;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    
    // Sauvegarder le volume si ce n'est pas mute
    if (newVolume > 0) {
      previousVolume.current = newVolume;
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 bg-black/30 backdrop-blur-md rounded-full p-3 border border-white/20"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <audio
        ref={audioRef}
        src="/audio/african_ambiant.mp3"
        preload="auto"
      />
      
      <div className="flex items-center gap-2">
        {/* Bouton Play/Pause */}
        <motion.button
          onClick={toggleAudio}
          disabled={!isLoaded}
          className="text-white hover:text-yellow-400 transition-colors p-1 disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </motion.button>
        
        {/* Bouton Mute/Unmute */}
        <motion.button
          onClick={toggleMute}
          disabled={!isLoaded}
          className="text-white hover:text-yellow-400 transition-colors p-1 disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isMuted ? "Activer le son" : "Couper le son"}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </motion.button>
        
        {/* Slider de volume */}
        <motion.input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          disabled={!isLoaded}
          className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 64, opacity: 1 }}
          transition={{ duration: 0.3 }}
          title={`Volume: ${Math.round(volume * 100)}%`}
        />
        
        {/* Indicateur de chargement */}
        {!isLoaded && (
          <div className="w-3 h-3 border border-white/50 border-t-yellow-400 rounded-full animate-spin"></div>
        )}
      </div>
      
      <style>
        {`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #fbbf24;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #fbbf24;
          cursor: pointer;
          border: none;
        }
        `}
      </style>
    </motion.div>
  );
};

export default AmbientAudio;
