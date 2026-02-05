'use client';

import { useState, useEffect, useCallback } from 'react';

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50 + Math.random() * 30);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}

const mockCard = {
  id: 'test-123',
  slug: 'test',
  sender_name: 'Alex',
  recipient_name: 'Jordan',
  message: 'Every moment with you feels like magic. You make my heart skip a beat.',
  response: null,
  responded_at: null,
};

export default function ReceiveTestPage() {
  const [animStage, setAnimStage] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [responded, setResponded] = useState(false);

  const [noScale, setNoScale] = useState(1);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);
  const [isFlying, setIsFlying] = useState(false);
  const [showTease, setShowTease] = useState(false);

  const card = mockCard;

  const teaseMessages = [
    "Nice try!",
    "That button's shy...",
    "Give up yet?",
    "There's only one answer...",
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimStage(1), 300),
      setTimeout(() => setAnimStage(2), 800),
      setTimeout(() => setAnimStage(3), 1300),
      setTimeout(() => setAnimStage(4), 1800),
      setTimeout(() => setAnimStage(5), 2300),
      setTimeout(() => setAnimStage(6), 2800),
      setTimeout(() => setShowMessage(true), 3300),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleMessageComplete = () => {
    setShowButtons(true);
  };

  const handleYes = () => {
    setResponded(true);
  };

  const escapeNo = useCallback(() => {
    const newAttempts = noAttempts + 1;
    setNoAttempts(newAttempts);

    if (newAttempts >= 3) setShowTease(true);

    if (newAttempts === 1) {
      // First click: just shrink
      setNoScale(0.7);
    } else if (newAttempts === 2) {
      // Second click: move away
      setNoPosition({
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 60,
      });
      setNoScale(0.6);
    } else {
      // Third+ click: fly around entire frame
      setIsFlying(true);
    }
  }, [noAttempts]);

  useEffect(() => {
    if (!isFlying) return;
    const interval = setInterval(() => {
      // Move around entire viewport
      setNoPosition({
        x: (Math.random() - 0.5) * (window.innerWidth * 0.7),
        y: (Math.random() - 0.5) * (window.innerHeight * 0.5),
      });
    }, 180);
    return () => clearInterval(interval);
  }, [isFlying]);

  const reset = () => {
    setAnimStage(0);
    setResponded(false);
    setShowMessage(false);
    setShowButtons(false);
    setNoScale(1);
    setNoPosition({ x: 0, y: 0 });
    setNoAttempts(0);
    setIsFlying(false);
    setShowTease(false);
    setTimeout(() => {
      setAnimStage(1);
      setTimeout(() => setAnimStage(2), 500);
      setTimeout(() => setAnimStage(3), 1000);
      setTimeout(() => setAnimStage(4), 1500);
      setTimeout(() => setAnimStage(5), 2000);
      setTimeout(() => setAnimStage(6), 2500);
      setTimeout(() => setShowMessage(true), 3000);
    }, 300);
  };

  if (responded) {
    return (
      <main className="min-h-screen bg-[#5c1a1a] flex items-center justify-center p-4">
        <div className="text-center animate-scale-in">
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#8b2a2a] to-[#5c1515] shadow-xl flex items-center justify-center border-4 border-[#7a2525]">
            <svg className="w-10 h-10 md:w-12 md:h-12 text-[#3d1010]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className="bg-[#f5f0e8] rounded-sm shadow-2xl p-8 md:p-12 max-w-md mx-auto">
            <h1 className="font-display text-3xl md:text-4xl text-[#5c1a1a] mb-4">I knew you would say yes!</h1>
            <p className="text-[#8b6b5c] text-lg">Happy valentines :))</p>
          </div>
          <button onClick={reset} className="mt-10 text-sm text-[#f5f0e8]/50 hover:text-[#f5f0e8]/80 transition-colors">
            Reset demo
          </button>
        </div>
      </main>
    );
  }

  const getCardReveal = () => {
    if (animStage < 3) return 0;
    if (animStage === 3) return 15;
    if (animStage === 4) return 40;
    if (animStage === 5) return 70;
    return 100;
  };

  const cardReveal = getCardReveal();

  return (
    <main className="min-h-screen bg-[#5c1a1a] flex items-center justify-center overflow-hidden relative p-4">
      {/* Test badge */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 text-xs text-[#f5f0e8]/40 bg-[#3d1010]/50 px-3 py-1 rounded-full z-50">
        Test Mode
      </div>
      <button onClick={reset} className="fixed bottom-4 left-1/2 -translate-x-1/2 text-sm text-[#f5f0e8]/40 hover:text-[#f5f0e8]/70 transition-colors z-50">
        Reset demo
      </button>

      {/* Everything centered as a single unit */}
      <div className="relative flex flex-col items-center">

        {/* POSTBOX - stays visible behind card, positioned relative to center */}
        <div
          className={`transition-all duration-700 ${
            animStage === 0 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{ zIndex: 1 }}
        >
          <div className="w-80 h-48 md:w-[450px] md:h-56 bg-gradient-to-b from-[#8b2a2a] to-[#6b1c1c] rounded-t-[50px] rounded-b-2xl shadow-2xl relative">
            <div className="absolute top-6 left-10 w-24 h-4 bg-white/10 rounded-full"></div>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
              <svg className="w-12 h-12 text-[#f5f0e8]/10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            {/* Slot at bottom of postbox */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2">
              <div
                className={`bg-[#1a0606] rounded-lg transition-all duration-500 ${
                  animStage >= 2 ? 'w-56 md:w-72 h-5 md:h-6' : 'w-32 h-1'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Card + Question container - overlaps postbox, in front */}
        <div className="relative flex flex-col items-center -mt-8" style={{ zIndex: 10 }}>

          {/* Card reveal container */}
          <div
            className="relative transition-all duration-500"
            style={{
              height: animStage >= 6 ? 'auto' : '260px',
              overflow: animStage >= 6 ? 'visible' : 'hidden',
            }}
          >
            <div
              className="transition-all ease-out"
              style={{
                transform: `translateY(${cardReveal === 0 ? '-100%' : cardReveal === 100 ? '0%' : `${-100 + cardReveal}%`})`,
                transitionDuration: '800ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Wax seal */}
              <div
                className="flex justify-center mb-3 transition-all duration-500"
                style={{
                  opacity: animStage >= 6 ? 1 : 0,
                  transform: `scale(${animStage >= 6 ? 1 : 0.5})`,
                }}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#8b2a2a] to-[#5c1515] shadow-lg flex items-center justify-center border-2 border-[#7a2525]">
                  <svg className="w-7 h-7 md:w-8 md:h-8 text-[#3d1010]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>

              {/* The Card */}
              <div className="bg-[#f5f0e8] w-[300px] md:w-[400px] rounded-sm shadow-2xl p-6 md:p-10 relative">
                <div className="absolute inset-3 md:inset-4 border border-[#d4c4b0]/50 rounded-sm pointer-events-none"></div>
                <div className="relative z-10 text-center py-4">
                  <div className="min-h-[80px] md:min-h-[100px] flex items-center justify-center">
                    {showMessage ? (
                      <p className="font-handwritten text-xl md:text-2xl text-[#5c1a1a] leading-relaxed">
                        <TypewriterText text={card.message} onComplete={handleMessageComplete} />
                      </p>
                    ) : (
                      <p className="font-handwritten text-xl text-[#5c1a1a]/20">...</p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#d4c4b0]/40">
                    <p className="text-[#8b6b5c] text-xs tracking-[0.2em] uppercase">from {card.sender_name}</p>
                    <p className="font-display text-lg md:text-xl text-[#5c1a1a] mt-1">to {card.recipient_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question + Buttons - directly below card */}
          <div
            className={`mt-6 transition-all duration-700 ${
              showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <h2 className="font-display text-xl md:text-2xl text-center text-[#f5f0e8] mb-5 lowercase tracking-wide">
              will you be my valentine?
            </h2>
            <div className="flex justify-center items-center gap-4 relative">
              <button
                onClick={handleYes}
                className="px-10 md:px-14 py-3 md:py-4 bg-[#f5f0e8] hover:bg-white text-[#5c1a1a] rounded-sm font-medium text-base md:text-lg tracking-wide shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                Yes
              </button>
              <button
                onClick={escapeNo}
                style={{
                  transform: `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale})`,
                  transition: isFlying ? 'transform 0.12s ease-out' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className="px-10 md:px-14 py-3 md:py-4 bg-transparent border border-[#f5f0e8]/40 hover:border-[#f5f0e8]/60 text-[#f5f0e8]/70 hover:text-[#f5f0e8] rounded-sm font-medium text-base md:text-lg tracking-wide transition-colors"
              >
                No
              </button>
            </div>
            {showTease && (
              <p className="text-center text-[#f5f0e8]/50 text-sm mt-4 animate-fade-in">
                {teaseMessages[Math.min(noAttempts - 3, teaseMessages.length - 1)]}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
