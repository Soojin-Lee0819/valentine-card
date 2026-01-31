'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

type Card = {
  id: string;
  slug: string;
  sender_name: string;
  recipient_name: string;
  message: string;
  response: 'yes' | 'no' | null;
  responded_at: string | null;
};

export default function CheckPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCard = async () => {
    try {
      const res = await fetch(`/api/cards/${slug}`);
      if (!res.ok) throw new Error('Card not found');
      const data = await res.json();
      setCard(data);
    } catch (err) {
      setError('Card not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCard();
    // Poll every 10 seconds if no response yet
    const interval = setInterval(() => {
      if (!card?.response) {
        fetchCard();
      }
    }, 10000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

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
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300">
          <div className="text-center">
            {card.response === null ? (
              <>
                <div className="text-6xl mb-6 animate-pulse">💌</div>
                <h1 className="text-2xl font-bold text-pink-600 mb-4">
                  Waiting for a response...
                </h1>
                <p className="text-gray-600 mb-2">
                  Your card to <span className="font-semibold">{card.recipient_name}</span>
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  This page auto-refreshes every 10 seconds
                </p>
                <div className="flex justify-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <button
                  onClick={fetchCard}
                  className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-medium"
                >
                  Refresh Now
                </button>
              </>
            ) : card.response === 'yes' ? (
              <>
                <div className="text-8xl mb-6 animate-bounce">💕</div>
                <h1 className="text-3xl font-bold text-pink-600 mb-4">
                  They said YES!
                </h1>
                <p className="text-gray-600 text-lg mb-4">
                  {card.recipient_name} will be your Valentine!
                </p>
                <div className="text-5xl mb-6">
                  🎉💖🎉
                </div>
                <p className="text-gray-400 text-sm">
                  Responded {new Date(card.responded_at!).toLocaleString()}
                </p>
              </>
            ) : (
              <>
                <div className="text-8xl mb-6">💔</div>
                <h1 className="text-3xl font-bold text-gray-600 mb-4">
                  They said no...
                </h1>
                <p className="text-gray-500 mb-4">
                  {card.recipient_name} declined. There are plenty of fish in the sea!
                </p>
                <p className="text-gray-400 text-sm">
                  Responded {new Date(card.responded_at!).toLocaleString()}
                </p>
              </>
            )}
          </div>

          <div className="mt-8 pt-6 border-t-2 border-pink-100">
            <Link
              href="/"
              className="block w-full py-3 text-center border-2 border-pink-300 text-pink-600 font-medium rounded-xl hover:bg-pink-50 transition-colors"
            >
              Create Another Card
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
