'use client';

import { useState, useEffect, use, useCallback } from 'react';

type Card = {
  id: string;
  slug: string;
  sender_name: string;
  recipient_name: string;
  message: string;
  image_url: string | null;
  response: 'yes' | 'no' | null;
  responded_at: string | null;
};

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 35 + Math.random() * 25);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse opacity-60">|</span>
      )}
    </span>
  );
}

export default function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responded, setResponded] = useState(false);
  const [response, setResponse] = useState<'yes' | 'no' | null>(null);

  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  const [noScale, setNoScale] = useState(1);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`/api/cards/${slug}`);
        if (!res.ok) throw new Error('Card not found');
        const data = await res.json();
        setCard(data);
        if (data.response) {
          setResponded(true);
          setResponse(data.response);
        }
      } catch (err) {
        setError('Card not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [slug]);

  const openEnvelope = () => {
    setIsEnvelopeOpen(true);
    setTimeout(() => setShowCard(true), 500);
    setTimeout(() => setShowMessage(true), 1000);
  };

  const handleYes = async () => {
    try {
      const res = await fetch(`/api/cards/${slug}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: 'yes' }),
      });
      if (res.ok) {
        setResponded(true);
        setResponse('yes');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // No button never actually works - it just keeps escaping!

  const escapeNo = useCallback(() => {
    setNoAttempts(prev => prev + 1);

    if (noAttempts < 2) {
      setNoScale(prev => prev * 0.75);
    } else if (noAttempts < 5) {
      const maxOffset = 80 + (noAttempts * 25);
      setNoPosition({
        x: (Math.random() - 0.5) * maxOffset,
        y: (Math.random() - 0.5) * maxOffset,
      });
      setNoScale(prev => Math.max(prev * 0.85, 0.4));
    } else {
      setIsFlying(true);
    }
  }, [noAttempts]);

  useEffect(() => {
    if (!isFlying) return;
    const interval = setInterval(() => {
      setNoPosition({
        x: (Math.random() - 0.5) * 180,
        y: (Math.random() - 0.5) * 120,
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isFlying]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </main>
    );
  }

  if (error || !card) {
    return (
      <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="font-display text-2xl text-gray-700 mb-2">Card not found</h1>
          <p className="text-gray-500">This card may no longer exist.</p>
        </div>
      </main>
    );
  }

  if (responded) {
    return (
      <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-md w-full">
          {card.image_url ? (
            <>
              <h1 className="font-display text-3xl text-gray-800 mb-2">
                I knew you'd say yes
              </h1>
              <p className="text-gray-500 mb-6">
                I'm so happy you're my Valentine
              </p>
              <img
                src={card.image_url}
                alt="From your Valentine"
                className="w-full max-w-xs mx-auto rounded-xl mb-6"
              />
              <p className="text-gray-600 italic">
                — {card.sender_name}
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#c45c5c]/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#c45c5c]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h1 className="font-display text-3xl text-gray-800 mb-2">
                It's a match!
              </h1>
              <p className="text-gray-500 mb-4">
                {card.sender_name} is going to be so happy
              </p>
            </>
          )}
        </div>
      </main>
    );
  }

  // Envelope view
  if (!isEnvelopeOpen) {
    return (
      <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 mb-6">You've received a card</p>

          <button
            onClick={openEnvelope}
            className="group relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <div className="w-72 h-44 bg-gradient-to-br from-[#e8d4d4] to-[#d4c4c4] rounded-lg shadow-lg relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-br from-[#d4c4c4] to-[#c4b4b4] origin-top"
                style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}
              />
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#c45c5c] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div className="absolute bottom-5 left-0 right-0 text-center">
                <p className="text-sm text-gray-600">To:</p>
                <p className="font-display text-xl text-gray-800">{card.recipient_name}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-4 group-hover:text-gray-600 transition-colors">
              Tap to open
            </p>
          </button>
        </div>
      </main>
    );
  }

  // Card view
  return (
    <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4 overflow-hidden">
      <div
        className={`w-full max-w-md transition-all duration-500 ${
          showCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-4">
            <p className="text-sm text-gray-400">To</p>
            <p className="font-display text-2xl text-gray-800">{card.recipient_name}</p>
          </div>

          <div className="min-h-[180px] mb-6 py-4 border-t border-b border-gray-100">
            {showMessage && (
              <p className="font-handwritten text-2xl text-gray-700 leading-relaxed">
                <TypewriterText
                  text={card.message}
                  onComplete={() => setShowButtons(true)}
                />
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400">From</p>
            <p className="font-display text-xl text-gray-800">{card.sender_name}</p>
          </div>
        </div>

        <div
          className={`mt-8 transition-all duration-500 ${
            showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="flex justify-center items-center gap-4 relative min-h-[60px]">
            <button
              onClick={handleYes}
              className="px-8 py-3 bg-[#c45c5c] hover:bg-[#b54d4d] text-white rounded-full font-medium transition-colors"
            >
              Yes
            </button>

            <button
              onMouseEnter={escapeNo}
              onTouchStart={escapeNo}
              onClick={escapeNo}
              style={{
                transform: `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale})`,
                transition: isFlying ? 'transform 0.15s ease-out' : 'transform 0.25s ease-out',
              }}
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-500 rounded-full font-medium transition-colors"
            >
              No
            </button>
          </div>

          {noAttempts > 2 && noAttempts < 6 && (
            <p className="text-center text-gray-400 text-sm mt-4">
              Having trouble?
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
