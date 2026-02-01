'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function DemoSection() {
  const [noScale, setNoScale] = useState(1);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const [isFlying, setIsFlying] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const escapeNo = useCallback(() => {
    setAttempts(prev => prev + 1);

    if (attempts < 2) {
      setNoScale(prev => prev * 0.7);
    } else if (attempts < 5) {
      const maxOffset = 80 + (attempts * 20);
      setNoPosition({
        x: (Math.random() - 0.5) * maxOffset,
        y: (Math.random() - 0.5) * maxOffset,
      });
      setNoScale(prev => Math.max(prev * 0.85, 0.3));
    } else {
      setIsFlying(true);
      setShowReset(true);
    }
  }, [attempts]);

  useEffect(() => {
    if (!isFlying) return;
    const interval = setInterval(() => {
      setNoPosition({
        x: (Math.random() - 0.5) * 150,
        y: (Math.random() - 0.5) * 100,
      });
    }, 250);
    return () => clearInterval(interval);
  }, [isFlying]);

  const resetDemo = () => {
    setNoScale(1);
    setNoPosition({ x: 0, y: 0 });
    setAttempts(0);
    setIsFlying(false);
    setShowReset(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl p-6 border-4 border-dashed border-pink-300 relative overflow-hidden">
      <div className="text-center mb-4">
        <p className="font-caveat text-2xl text-pink-600 mb-1">~ Try clicking &quot;No&quot; ~</p>
        <p className="text-gray-500 text-sm">(hover over it and see what happens!)</p>
      </div>

      <div className="flex justify-center items-center gap-4 min-h-[80px] relative">
        <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xl font-bold rounded-2xl shadow-lg font-caveat">
          Yes!
        </button>

        <button
          onMouseEnter={escapeNo}
          onTouchStart={escapeNo}
          style={{
            transform: `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale})`,
            transition: isFlying ? 'transform 0.15s ease-out' : 'transform 0.3s ease-out',
          }}
          className="px-4 py-2 bg-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-400 transition-colors"
        >
          No
        </button>
      </div>

      {attempts > 0 && attempts < 4 && (
        <p className="text-center text-pink-500 font-caveat text-xl mt-3 animate-pulse">
          hehe... try again~
        </p>
      )}
      {attempts >= 4 && (
        <p className="text-center text-pink-500 font-caveat text-xl mt-3 animate-bounce">
          you can&apos;t say no!!
        </p>
      )}

      {showReset && (
        <button
          onClick={resetDemo}
          className="absolute top-2 right-2 text-xs text-pink-400 hover:text-pink-600 underline"
        >
          reset demo
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderName, recipientName, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to create card');
      }

      const data = await response.json();
      router.push(`/share/${data.slug}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-pink-200 py-8 px-4">
      {/* Floating hearts decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-20">💕</div>
        <div className="absolute top-20 right-20 text-3xl animate-pulse opacity-20">💗</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce opacity-20" style={{animationDelay: '0.5s'}}>💖</div>
        <div className="absolute bottom-40 right-10 text-3xl animate-pulse opacity-20" style={{animationDelay: '0.3s'}}>💝</div>
      </div>

      <div className="max-w-lg mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="font-caveat text-6xl md:text-7xl text-pink-600 mb-4 leading-tight">
            Make a Valentine<br/>They Can&apos;t Refuse!
          </h1>
          <p className="font-patrick text-xl md:text-2xl text-pink-500/80 mb-2">
            Create an irresistible card...
          </p>
          <p className="font-caveat text-3xl text-red-500 animate-pulse">
            They&apos;ll never say no!
          </p>
        </div>

        {/* Demo Section */}
        <div className="mb-8">
          <DemoSection />
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300 relative">
          {/* Corner decorations */}
          <div className="absolute -top-3 -left-3 text-3xl rotate-[-20deg]">💌</div>
          <div className="absolute -top-3 -right-3 text-3xl rotate-[20deg]">💌</div>

          <div className="text-center mb-6">
            <h2 className="font-caveat text-4xl text-pink-600 mb-2">
              Write Your Card
            </h2>
            <p className="font-patrick text-gray-500">
              fill in the details below~
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-patrick text-lg text-pink-600 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="who's sending the love?"
                required
                maxLength={50}
                className="w-full px-4 py-3 rounded-2xl border-3 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors text-gray-700 font-patrick text-lg bg-pink-50/50"
              />
            </div>

            <div>
              <label className="block font-patrick text-lg text-pink-600 mb-2">
                Their Name
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="who's the lucky one?"
                required
                maxLength={50}
                className="w-full px-4 py-3 rounded-2xl border-3 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors text-gray-700 font-patrick text-lg bg-pink-50/50"
              />
            </div>

            <div>
              <label className="block font-patrick text-lg text-pink-600 mb-2">
                Your Sweet Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="write something from your heart... 💕"
                required
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border-3 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors resize-none text-gray-700 font-patrick text-lg bg-pink-50/50"
              />
              <p className="font-patrick text-sm text-pink-300 mt-1 text-right">
                {message.length}/500
              </p>
            </div>

            {error && (
              <p className="text-red-500 text-center font-patrick">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-caveat text-2xl rounded-2xl hover:from-pink-600 hover:to-red-600 transition-all transform hover:scale-[1.02] hover:rotate-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg border-b-4 border-red-600"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  creating magic...
                </span>
              ) : (
                'Send the Love! 💝'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center font-caveat text-xl text-pink-400 mt-8">
          made with lots of love 💕
        </p>
      </div>
    </main>
  );
}
