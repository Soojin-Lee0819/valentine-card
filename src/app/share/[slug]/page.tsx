'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

type Card = {
  id: string;
  slug: string;
  sender_name: string;
  recipient_name: string;
  message: string;
};

export default function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [card, setCard] = useState<Card | null>(null);
  const [animStage, setAnimStage] = useState(0);

  useEffect(() => {
    setBaseUrl(window.location.origin);

    const fetchCard = async () => {
      try {
        const res = await fetch(`/api/cards/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setCard(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCard();
  }, [slug]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimStage(1), 500),
      setTimeout(() => setAnimStage(2), 1000),
      setTimeout(() => setAnimStage(3), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const cardLink = `${baseUrl}/card/${slug}`;
  const shareText = card ? `You received a surprise message from ${card.sender_name} 💌` : `You received a surprise message 💌`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cardLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToSMS = () => {
    window.open(`sms:?body=${encodeURIComponent(shareText + ' ' + cardLink)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + cardLink)}`, '_blank');
  };

  const shareToInstagram = () => {
    copyToClipboard();
    window.open('https://instagram.com', '_blank');
  };

  return (
    <main className="min-h-screen bg-[#5c1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f5f0e8] flex items-center justify-center">
            <svg className="w-7 h-7 text-[#5c1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-[#f5f0e8]">Card created!</h1>
        </div>

        {/* Mini card preview */}
        <div className="mb-8">
          <div
            className={`bg-[#f5f0e8] rounded-sm p-5 shadow-2xl max-w-[300px] mx-auto transition-all duration-700 ${
              animStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="border border-[#d4c4b0]/50 rounded-sm p-5">
              <div className="text-center min-h-[60px] flex items-center justify-center">
                <p
                  className={`font-handwritten text-xl text-[#5c1a1a] leading-relaxed transition-all duration-500 ${
                    animStage >= 2 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {card?.message ? (card.message.length > 50 ? card.message.slice(0, 50) + '...' : card.message) : '...'}
                </p>
              </div>
              <div
                className={`mt-4 pt-4 border-t border-[#d4c4b0]/40 text-center transition-all duration-500 ${
                  animStage >= 3 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="text-[#8b6b5c] text-xs tracking-[0.2em] uppercase">from {card?.sender_name || '...'}</p>
                <p className="font-display text-base text-[#5c1a1a] mt-1">to {card?.recipient_name || '...'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Share section */}
        <p className="text-[#f5f0e8]/60 text-center text-sm mb-4">Share with your Valentine</p>

        {/* Share buttons */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={shareToSMS}
            className="w-12 h-12 rounded-full bg-[#f5f0e8] hover:bg-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            title="Send via SMS"
          >
            <svg className="w-5 h-5 text-[#5c1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>

          <button
            onClick={shareToWhatsApp}
            className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            title="Share on WhatsApp"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>

          <button
            onClick={shareToInstagram}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            title="Copy link & open Instagram"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </button>

          <button
            onClick={copyToClipboard}
            className="w-12 h-12 rounded-full bg-[#f5f0e8] hover:bg-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
            title="Copy link"
          >
            {copied ? (
              <svg className="w-5 h-5 text-[#5c1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-[#5c1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            )}
          </button>
        </div>

        {/* Copy link section */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={cardLink}
            readOnly
            className="flex-1 px-4 py-3 rounded-sm bg-[#f5f0e8] text-[#5c1a1a] text-sm"
          />
          <button
            onClick={copyToClipboard}
            className="px-5 py-3 bg-[#f5f0e8] text-[#5c1a1a] rounded-sm hover:bg-white transition-colors font-medium text-sm shadow-lg"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Bottom links */}
        <div className="space-y-3">
          <Link
            href={`/card/${slug}`}
            className="block w-full py-3 text-center border border-[#f5f0e8]/30 text-[#f5f0e8] font-medium rounded-sm hover:bg-[#f5f0e8]/10 transition-colors"
          >
            Preview full card
          </Link>
          <Link
            href="/"
            className="block w-full py-3 text-center text-[#f5f0e8]/40 hover:text-[#f5f0e8]/70 transition-colors text-sm"
          >
            Create another
          </Link>
        </div>
      </div>
    </main>
  );
}
