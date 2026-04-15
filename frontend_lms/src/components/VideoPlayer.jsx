import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';

const VideoPlayer = ({ url }) => {
  const [userInfo, setUserInfo] = useState('');
  const playerRef = useRef(null);
  
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserInfo(user.email || user.username || `User ID: ${user.id}`);
    }
    
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group border border-gray-800">
      <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
        {/* Dynamic Watermark - deterrence */}
        <div className="transform -rotate-12 opacity-30 pointer-events-none select-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="text-white/40 text-xl font-bold whitespace-nowrap p-4 drop-shadow-md">
              {userInfo} - {new Date().toLocaleDateString()}
            </div>
          ))}
        </div>
      </div>
      
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        controls={true}
        config={{
          youtube: {
            playerVars: { 
              modestbranding: 1,
              rel: 0,
              fs: 0, // Disable full screen to keep watermark active within browser constraints
            }
          }
        }}
        style={{ pointerEvents: 'auto' }}
      />
      
      {/* Invisible overlay over the player to intercept certain clicks but allow play/pause, usually YouTube iframe absorbs clicks though, contextmenu event blocks it on the wrapper level */}
      <div className="absolute inset-0 z-0 pointer-events-none"></div>
    </div>
  );
};

export default VideoPlayer;
