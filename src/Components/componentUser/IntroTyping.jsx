// src/Components/IntroTyping.jsx
import React, { useEffect, useState } from "react";

const IntroTyping = ({ 
  messages = [
    "CHÀO MỪNG BẠN ĐẾN VỚI KHÁCH SẠN 8BROSS",
    
  ],
  typingSpeed = 40,
  pauseDuration = 500,
  deletingSpeed = 25
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [phase, setPhase] = useState('intro'); // intro, icons, fadeOut

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 400);
    return () => clearInterval(cursorInterval);
  }, []);

  // Main typing effect
  useEffect(() => {
    if (isComplete || phase !== 'intro') return;

    const currentMessage = messages[currentMessageIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting && currentCharIndex < currentMessage.length) {
        // Typing forward
        setDisplayedText(currentMessage.slice(0, currentCharIndex + 1));
        setCurrentCharIndex(prev => prev + 1);
      } else if (!isDeleting && currentCharIndex === currentMessage.length) {
        // Pause at end of message
        setTimeout(() => {
          if (currentMessageIndex === messages.length - 1) {
            // Last message - move to icons phase
            setPhase('icons');
          } else {
            // Start deleting
            setIsDeleting(true);
          }
        }, pauseDuration);
      } else if (isDeleting && currentCharIndex > 0) {
        // Deleting backward
        setDisplayedText(currentMessage.slice(0, currentCharIndex - 1));
        setCurrentCharIndex(prev => prev - 1);
      } else if (isDeleting && currentCharIndex === 0) {
        // Move to next message
        setIsDeleting(false);
        setCurrentMessageIndex(prev => prev + 1);
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentCharIndex, currentMessageIndex, isDeleting, isComplete, phase, messages, typingSpeed, pauseDuration, deletingSpeed]);

  // Icons phase effect
  useEffect(() => {
    if (phase === 'icons') {
      const iconTimer = setTimeout(() => {
        setPhase('fadeOut');
        setTimeout(() => {
          setIsVisible(false);
        }, 800);
      }, 800);
      return () => clearTimeout(iconTimer);
    }
  }, [phase]);

  if (!isVisible) return null;

  const renderIcons = () => {
    
    return (
      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {icons.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center transform animate-bounce"
            style={{ 
              animationDelay: `${index * 0.2}s`,
              animationDuration: '1s'
            }}
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            <p className="text-sm font-semibold text-gray-700">{item.label}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center z-50 transition-all duration-1000 ${
      phase === 'fadeOut' ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
    }`}>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 ">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-30 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="mb-8">
          <div className="relative">
           
            <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 opacity-40 rounded-full blur-xl animate-pulse"></div>
          </div>
        </div>
        {phase === 'intro' && (
          <div className="mb-8">
            <h1 className="text-white text-3xl md:text-7xl lg:text-8xl font-black leading-tight tracking-wide">
              {displayedText}
              <span className={`ml-2 inline-block w-1 md:w-2 h-8 md:h-12 lg:h-16 bg-gradient-to-b from-yellow-400 to-orange-400 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-100`}></span>
            </h1>
          </div>
        )}

       

        
      </div>
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-slide-up {
          animation: slideInUp 0.6s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Responsive text sizing */
        @media (max-width: 640px) {
          h1 {
            font-size: 1.5rem !important;
            line-height: 1.2 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default IntroTyping;