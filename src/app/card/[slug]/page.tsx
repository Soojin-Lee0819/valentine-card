'use client';

import { useState, useEffect, use, useCallback } from 'react';

type Card = {
  id: string;
  slug: string;
  sender_name: string;
  recipient_name: string;
  message: string;
  response: 'yes' | 'no' | null;
  responded_at: string | null;
};

export default function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responded, setResponded] = useState(false);
  const [response, setResponse] = useState<'yes' | 'no' | null>(null);

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

    if (noAttempts < 3) {
      // First few attempts: shrink the button
      setNoScale(prev => prev * 0.7);
    } else if (noAttempts < 6) {
      // Next attempts: start moving randomly
      const maxOffset = 100 + (noAttempts * 30);
      setNoPosition({
        x: (Math.random() - 0.5) * maxOffset,
        y: (Math.random() - 0.5) * maxOffset,
      });
      setNoScale(prev => Math.max(prev * 0.85, 0.3));
    } else {
      // After many attempts: fly around continuously
      setIsFlying(true);
    }
  }, [noAttempts]);

  // Flying animation
  useEffect(() => {
    if (!isFlying) return;

    const interval = setInterval(() => {
      setNoPosition({
        x: (Math.random() - 0.5) * 250,
        y: (Math.random() - 0.5) * 250,
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isFlying]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 flex items-center justify-center">
        <div className="text-2xl text-pink-600 animate-pulse">Loading...</div>
      </main>
    );
  }

  if (error || !card) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300 text-center">
          <div className="text-6xl mb-4">💔</div>
          <h1 className="text-2xl font-bold text-gray-700">Card not found</h1>
          <p className="text-gray-500 mt-2">This card may have been deleted or never existed.</p>
        </div>
      </main>
    );
  }

  if (responded) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300 text-center max-w-md">
          {response === 'yes' ? (
            <>
              <div className="text-8xl mb-6 animate-bounce">💕</div>
              <h1 className="text-3xl font-bold text-pink-600 mb-4">
                Yay! It&apos;s a match!
              </h1>
              <p className="text-gray-600 text-lg">
                {card.sender_name} is going to be so happy!
              </p>
              <div className="mt-8 text-6xl">
                🎉💖🎉
              </div>
            </>
          ) : (
            <>
              <div className="text-8xl mb-6">💔</div>
              <h1 className="text-3xl font-bold text-gray-600 mb-4">
                Maybe next time...
              </h1>
              <p className="text-gray-500">
                {card.sender_name} will understand.
              </p>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300 relative">
          {/* Decorative hearts */}
          <div className="absolute -top-4 -left-4 text-4xl animate-pulse">💝</div>
          <div className="absolute -top-4 -right-4 text-4xl animate-pulse delay-100">💝</div>

          <div className="text-center mb-6">
            <p className="text-gray-500 mb-2">A message for</p>
            <h1 className="text-3xl font-bold text-pink-600 mb-1">
              {card.recipient_name}
            </h1>
            <p className="text-gray-500">from {card.sender_name}</p>
          </div>

          <div className="bg-pink-50 rounded-2xl p-6 mb-8 border-2 border-pink-100">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {card.message}
            </p>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-pink-600">
              Will you be my Valentine?
            </h2>
          </div>

          <div className="flex justify-center items-center gap-6 relative min-h-[120px]">
            {/* Yes button - big and inviting */}
            <button
              onClick={handleYes}
              className="px-12 py-6 bg-gradient-to-r from-pink-500 to-red-500 text-white text-2xl font-bold rounded-2xl hover:from-pink-600 hover:to-red-600 transition-all transform hover:scale-110 shadow-lg hover:shadow-xl"
            >
              Yes! 💕
            </button>

            {/* No button - tricky and escaping */}
            <button
              onClick={handleNo}
              onMouseEnter={escapeNo}
              onTouchStart={escapeNo}
              style={{
                transform: `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale})`,
                transition: isFlying ? 'transform 0.2s ease-out' : 'transform 0.3s ease-out',
              }}
              className="px-4 py-2 bg-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-400 transition-colors absolute right-0"
            >
              No
            </button>
          </div>

          {noAttempts > 0 && noAttempts < 5 && (
            <p className="text-center text-pink-400 text-sm mt-6 animate-pulse">
              Are you sure? 🥺
            </p>
          )}
          {noAttempts >= 5 && (
            <p className="text-center text-pink-400 text-sm mt-6 animate-pulse">
              Just say yes already! 💕
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
