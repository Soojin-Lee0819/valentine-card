'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const cardLink = `${baseUrl}/card/${slug}`;
  const checkLink = `${baseUrl}/check/${slug}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#c45c5c]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#c45c5c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-gray-800 mb-2">Card created</h1>
          <p className="text-gray-500">Share this link with your Valentine</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={cardLink}
              readOnly
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-sm"
            />
            <button
              onClick={() => copyToClipboard(cardLink)}
              className="px-4 py-3 bg-[#c45c5c] text-white rounded-xl hover:bg-[#b54d4d] transition-colors font-medium text-sm"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check responses
          </label>
          <p className="text-xs text-gray-400 mb-3">
            Bookmark this link to see when they respond
          </p>
          <input
            type="text"
            value={checkLink}
            readOnly
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600 text-sm"
          />
        </div>

        <div className="space-y-3">
          <Link
            href={`/card/${slug}`}
            className="block w-full py-3 text-center border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
          >
            Preview card
          </Link>
          <Link
            href="/"
            className="block w-full py-3 text-center text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            Create another
          </Link>
        </div>
      </div>
    </main>
  );
}
