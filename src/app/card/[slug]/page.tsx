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
      }, 40 + Math.random() * 30);
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

export default function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responded, setResponded] = useState(false);
  const [response, setResponse] = useState<'yes' | 'no' | null>(null);

  // Card opening states
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  // No button escape mechanics
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
    setTimeout(() => setShowCard(true), 600);
    setTimeout(() => setShowMessage(true), 1200);
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

  const handleNo = async () => {
    try {
      const res = await fetch(`/api/cards/${slug}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: 'no' }),
      });
      if (res.ok) {
        setResponded(true);
        setResponse('no');
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 150,
      });
    }, 250);
    return () => clearInterval(interval);
  }, [isFlying]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-200 flex items-center justify-center">
        <div className="font-caveat text-3xl text-pink-600 animate-pulse">Loading your letter...</div>
      </main>
    );
  }

  if (error || !card) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300 text-center">
          <div className="text-6xl mb-4">💔</div>
          <h1 className="font-caveat text-3xl text-gray-700">Letter not found</h1>
          <p className="font-patrick text-gray-500 mt-2">This letter may have been lost in the mail...</p>
        </div>
      </main>
    );
  }

  if (responded) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300 text-center max-w-md">
          {response === 'yes' ? (
            <>
              {card.image_url ? (
                <>
                  <div className="text-4xl mb-4 animate-bounce">💕</div>
                  <h1 className="font-caveat text-4xl text-pink-600 mb-4">
                    I knew you&apos;d say yes!
                  </h1>
                  <p className="font-patrick text-lg text-gray-600 mb-6">
                    I&apos;m so excited you&apos;re my Valentine!
                  </p>
                  <div className="relative mb-6">
                    <img
                      src={card.image_url}
                      alt="Surprise from your Valentine"
                      className="w-full max-w-xs mx-auto rounded-2xl border-4 border-pink-200 shadow-lg"
                    />
                    <div className="absolute -top-3 -right-3 text-3xl animate-bounce">💝</div>
                    <div className="absolute -bottom-3 -left-3 text-3xl animate-bounce" style={{animationDelay: '150ms'}}>💖</div>
                  </div>
                  <p className="font-caveat text-2xl text-pink-500">
                    ~ with love from {card.sender_name} ~
                  </p>
                </>
              ) : (
                <>
                  <div className="text-8xl mb-6 animate-bounce">💕</div>
                  <h1 className="font-caveat text-5xl text-pink-600 mb-4">
                    Yay! It&apos;s a match!
                  </h1>
                  <p className="font-patrick text-xl text-gray-600 mb-4">
                    I knew you&apos;d say yes!
                  </p>
                  <p className="font-caveat text-2xl text-pink-500 mb-6">
                    {card.sender_name} is so happy right now!
                  </p>
                  <div className="text-6xl flex justify-center gap-2">
                    <span className="animate-bounce" style={{animationDelay: '0ms'}}>🎉</span>
                    <span className="animate-bounce" style={{animationDelay: '100ms'}}>💖</span>
                    <span className="animate-bounce" style={{animationDelay: '200ms'}}>🎉</span>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="text-8xl mb-6">💔</div>
              <h1 className="font-caveat text-4xl text-gray-600 mb-4">
                Maybe next time...
              </h1>
              <p className="font-patrick text-gray-500">
                {card.sender_name} will understand.
              </p>
            </>
          )}
        </div>
      </main>
    );
  }

  // Envelope view (before opening)
  if (!isEnvelopeOpen) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-200 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="font-caveat text-2xl text-pink-500 mb-6 animate-pulse">
            You&apos;ve received a letter...
          </p>

          {/* Envelope */}
          <button
            onClick={openEnvelope}
            className="group relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            {/* Envelope body */}
            <div className="w-72 h-48 bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg shadow-2xl border-4 border-pink-400 relative overflow-hidden">
              {/* Envelope flap */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-pink-300 to-pink-400 origin-top transform transition-transform group-hover:rotate-x-12"
                style={{
                  clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                }}
              />

              {/* Heart seal */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 text-4xl z-10 group-hover:animate-bounce">
                💝
              </div>

              {/* To label */}
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="font-patrick text-pink-700 text-sm">To:</p>
                <p className="font-caveat text-2xl text-pink-800">{card.recipient_name}</p>
              </div>
            </div>

            <p className="font-patrick text-pink-600 mt-4 group-hover:text-pink-700">
              ~ tap to open ~
            </p>
          </button>
        </div>
      </main>
    );
  }

  // Card view (after opening)
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-200 flex items-center justify-center p-4 overflow-hidden">
      <div
        className={`w-full max-w-md transition-all duration-700 ${
          showCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Letter/Card */}
        <div className="bg-[#fffef5] rounded-lg shadow-2xl p-8 relative border-2 border-pink-200"
          style={{
            backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #f9d5d5 31px, #f9d5d5 32px)`,
          }}
        >
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* To section */}
          <div className="mb-6">
            <p className="font-patrick text-pink-400 text-lg">To:</p>
            <p className="font-caveat text-4xl text-pink-600 ml-4">{card.recipient_name}</p>
          </div>

          {/* Message */}
          <div className="min-h-[200px] mb-6 relative">
            {showMessage && (
              <p className="font-caveat text-2xl text-gray-700 leading-relaxed">
                <TypewriterText
                  text={card.message}
                  onComplete={() => setShowButtons(true)}
                />
              </p>
            )}
          </div>

          {/* From section */}
          <div className="text-right mb-8">
            <p className="font-patrick text-pink-400 text-lg">From:</p>
            <p className="font-caveat text-3xl text-pink-600 mr-4">{card.sender_name}</p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 text-2xl opacity-30">💕</div>
          <div className="absolute bottom-4 left-4 text-2xl opacity-30">💕</div>
        </div>

        {/* Response buttons */}
        <div
          className={`mt-8 transition-all duration-500 ${
            showButtons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex justify-center items-center gap-6 relative min-h-[80px]">
            {/* Yes button */}
            <button
              onClick={handleYes}
              className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white text-xl font-caveat rounded-full transition-all transform hover:scale-110 shadow-lg hover:shadow-xl border-2 border-pink-600"
            >
              Yes
            </button>

            {/* No button - similar look but escapes */}
            <button
              onClick={handleNo}
              onMouseEnter={escapeNo}
              onTouchStart={escapeNo}
              style={{
                transform: `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale})`,
                transition: isFlying ? 'transform 0.15s ease-out' : 'transform 0.3s ease-out',
              }}
              className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-500 text-xl font-caveat rounded-full transition-colors shadow-lg border-2 border-gray-300"
            >
              No
            </button>
          </div>

          {noAttempts > 0 && noAttempts < 4 && (
            <p className="text-center font-caveat text-xl text-pink-500 mt-4 animate-pulse">
              are you sure...? 🥺
            </p>
          )}
          {noAttempts >= 4 && (
            <p className="text-center font-caveat text-xl text-pink-500 mt-4 animate-bounce">
              just say yes already~ 💕
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
