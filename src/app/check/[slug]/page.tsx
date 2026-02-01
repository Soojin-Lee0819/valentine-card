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
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {card.response === null ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="font-display text-2xl text-gray-800 mb-2">
                Waiting for response
              </h1>
              <p className="text-gray-500 mb-1">
                Your card to <span className="font-medium">{card.recipient_name}</span>
              </p>
              <p className="text-gray-400 text-sm mb-6">
                This page refreshes automatically
              </p>
              <button
                onClick={fetchCard}
                className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Refresh now
              </button>
            </>
          ) : card.response === 'yes' ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#c45c5c]/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#c45c5c]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h1 className="font-display text-3xl text-gray-800 mb-2">
                They said yes!
              </h1>
              <p className="text-gray-500 mb-4">
                {card.recipient_name} will be your Valentine
              </p>
              <p className="text-gray-400 text-sm">
                {new Date(card.responded_at!).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-2xl text-gray-700 mb-2">
                They said no
              </h1>
              <p className="text-gray-500 mb-4">
                {card.recipient_name} declined.
              </p>
              <p className="text-gray-400 text-sm">
                {new Date(card.responded_at!).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </p>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            Create another card
          </Link>
        </div>
      </div>
    </main>
  );
}
