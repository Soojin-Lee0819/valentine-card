'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [copied, setCopied] = useState(false);
  const [copiedCheck, setCopiedCheck] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const cardLink = `${baseUrl}/card/${slug}`;
  const checkLink = `${baseUrl}/check/${slug}`;

  const copyToClipboard = async (text: string, type: 'card' | 'check') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'card') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCopiedCheck(true);
        setTimeout(() => setCopiedCheck(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-red-100 to-pink-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-300">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">💌</div>
            <h1 className="text-3xl font-bold text-pink-600 mb-2">
              Card Created!
            </h1>
            <p className="text-gray-600">
              Share this link with your special someone
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link for your Valentine
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cardLink}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-pink-200 bg-pink-50 text-gray-700 text-sm"
                />
                <button
                  onClick={() => copyToClipboard(cardLink, 'card')}
                  className="px-4 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-medium"
                >
                  {copied ? '✓' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="border-t-2 border-pink-100 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your check-back link (save this!)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Use this link to see if they responded
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={checkLink}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700 text-sm"
                />
                <button
                  onClick={() => copyToClipboard(checkLink, 'check')}
                  className="px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium"
                >
                  {copiedCheck ? '✓' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Link
                href={`/card/${slug}`}
                className="block w-full py-3 text-center bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-red-600 transition-all"
              >
                Preview Card
              </Link>
              <Link
                href="/"
                className="block w-full py-3 text-center border-2 border-pink-300 text-pink-600 font-medium rounded-xl hover:bg-pink-50 transition-colors"
              >
                Create Another Card
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
