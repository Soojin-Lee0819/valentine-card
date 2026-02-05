'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Onboarding Demo Component
function OnboardingDemo({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  const [step, setStep] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [isFlying, setIsFlying] = useState(false);

  const escapeNo = useCallback(() => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts === 1) {
      setNoScale(0.7);
    } else if (newAttempts === 2) {
      setNoPosition({
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 50,
      });
      setNoScale(0.6);
    } else {
      setIsFlying(true);
    }
  }, [attempts]);

  useEffect(() => {
    if (!isFlying) return;
    const interval = setInterval(() => {
      setNoPosition({
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 100,
      });
    }, 180);
    return () => clearInterval(interval);
  }, [isFlying]);

  const resetDemo = () => {
    setNoPosition({ x: 0, y: 0 });
    setNoScale(1);
    setAttempts(0);
    setIsFlying(false);
  };

  const steps = [
    {
      title: "Here's how it works",
      content: (
        <div className="text-center">
          <p className="text-[#f5f0e8]/70 mb-8">
            You write a heartfelt message, and we'll create a beautiful card with a little twist...
          </p>
          <div className="bg-[#f5f0e8] rounded-sm p-6 shadow-2xl max-w-sm mx-auto">
            <p className="text-[#8b6b5c] text-xs tracking-[0.2em] uppercase mb-2">Preview</p>
            <p className="font-handwritten text-2xl text-[#5c1a1a]">
              "Every moment with you feels like magic..."
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Afraid of rejection?",
      content: (
        <div className="text-center">
          <p className="text-[#f5f0e8]/70 mb-8">
            Don't worry—saying "No" is not that easy. Try clicking it.
          </p>
          <div className="bg-[#f5f0e8] rounded-sm p-8 shadow-2xl relative overflow-hidden min-h-[160px]">
            <p className="text-[#8b6b5c] text-xs tracking-[0.2em] uppercase mb-6">Try clicking "No"</p>
            <div className="flex justify-center items-center gap-4 relative">
              <button className="px-8 py-3 bg-[#5c1a1a] text-[#f5f0e8] rounded-sm font-medium">
                Yes
              </button>
              <button
                onClick={escapeNo}
                style={{
                  transform: `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale})`,
                  transition: isFlying ? 'transform 0.12s ease-out' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className="px-8 py-3 bg-transparent border border-[#5c1a1a]/30 text-[#5c1a1a]/60 rounded-sm font-medium"
              >
                No
              </button>
            </div>
            {attempts > 2 && (
              <button
                onClick={resetDemo}
                className="absolute bottom-2 right-2 text-xs text-[#8b6b5c]/50 hover:text-[#8b6b5c]"
              >
                reset
              </button>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#5c1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl text-[#f5f0e8] mb-4">{steps[step].title}</h1>
          <div className="flex justify-center gap-2 mt-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-[#f5f0e8]' : 'bg-[#f5f0e8]/30'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mb-10">{steps[step].content}</div>

        <div className="flex flex-col gap-3">
          {step < steps.length - 1 ? (
            <>
              <button
                onClick={() => { resetDemo(); setStep(step + 1); }}
                className="w-full py-3 md:py-4 bg-[#f5f0e8] text-[#5c1a1a] rounded-sm font-medium hover:bg-white transition-colors shadow-lg"
              >
                Next
              </button>
              <button
                onClick={onSkip}
                className="w-full py-3 text-[#f5f0e8]/50 hover:text-[#f5f0e8]/80 transition-colors text-sm"
              >
                Skip intro
              </button>
            </>
          ) : (
            <button
              onClick={onComplete}
              className="w-full py-3 md:py-4 bg-[#f5f0e8] text-[#5c1a1a] rounded-sm font-medium hover:bg-white transition-colors shadow-lg"
            >
              Create my card
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

// Card Creation Form
function CardForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('senderName', senderName);
      formData.append('recipientName', recipientName);
      formData.append('message', message);

      const response = await fetch('/api/cards', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to create card');

      const data = await response.json();
      router.push(`/share/${data.slug}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return senderName.trim() && recipientName.trim();
    if (step === 2) return message.trim();
    return true;
  };

  return (
    <main className="min-h-screen bg-[#5c1a1a] flex items-center justify-center p-4">
      <div className={`w-full transition-all ${step === 2 ? 'max-w-3xl' : 'max-w-md'}`}>
        {/* Progress */}
        <div className="flex items-center justify-center mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  s <= step
                    ? 'bg-[#f5f0e8] text-[#5c1a1a]'
                    : 'bg-[#f5f0e8]/20 text-[#f5f0e8]/50'
                }`}
              >
                {s}
              </div>
              {s < 2 && (
                <div
                  className={`w-16 sm:w-24 h-0.5 mx-3 transition-colors ${
                    s < step ? 'bg-[#f5f0e8]' : 'bg-[#f5f0e8]/20'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Names */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <h1 className="font-display text-3xl md:text-4xl text-[#f5f0e8] text-center mb-2">
              Who's this card for?
            </h1>
            <p className="text-[#f5f0e8]/60 text-center mb-8">
              Let's start with the basics
            </p>

            <div className="bg-[#f5f0e8] rounded-sm p-6 md:p-8 shadow-2xl space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5c1a1a] mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-sm border border-[#d4c4b0] focus:border-[#5c1a1a] focus:ring-1 focus:ring-[#5c1a1a] focus:outline-none transition-colors bg-white text-[#5c1a1a]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5c1a1a] mb-2">
                  Their name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter their name"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-sm border border-[#d4c4b0] focus:border-[#5c1a1a] focus:ring-1 focus:ring-[#5c1a1a] focus:outline-none transition-colors bg-white text-[#5c1a1a]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Message */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <h1 className="font-display text-3xl md:text-4xl text-[#f5f0e8] text-center mb-2">
              Write your message
            </h1>
            <p className="text-[#f5f0e8]/60 text-center mb-8">
              "Will you be my valentine?" is already on the card
            </p>

            {/* Side by side layout on desktop */}
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
              {/* Message input - left side */}
              <div className="flex-1 order-2 md:order-1">
                <div className="bg-[#f5f0e8] rounded-sm p-4 md:p-6 shadow-lg">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something from the heart..."
                    maxLength={500}
                    rows={6}
                    className="w-full px-4 py-3 rounded-sm border border-[#d4c4b0] focus:border-[#5c1a1a] focus:ring-1 focus:ring-[#5c1a1a] focus:outline-none transition-colors resize-none bg-white text-[#5c1a1a] font-handwritten text-lg"
                  />
                  <p className="text-xs text-[#8b6b5c] mt-2 text-right">
                    {message.length}/500
                  </p>
                </div>
              </div>

              {/* Live preview card - right side */}
              <div className="flex-1 order-1 md:order-2">
                <div className="bg-[#f5f0e8] rounded-sm p-4 md:p-5 shadow-2xl">
                  <div className="border border-[#d4c4b0]/50 rounded-sm p-4">
                    <div className="text-center min-h-[100px] flex items-center justify-center">
                      <p className="font-handwritten text-lg md:text-xl text-[#5c1a1a] leading-relaxed">
                        {message || <span className="text-[#5c1a1a]/30">Your message here...</span>}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#d4c4b0]/40 text-center">
                      <p className="text-[#8b6b5c] text-xs tracking-[0.2em] uppercase">from {senderName}</p>
                      <p className="font-display text-base text-[#5c1a1a] mt-1">to {recipientName}</p>
                    </div>
                  </div>
                  {/* Will you be my valentine + buttons preview */}
                  <p className="text-center text-[#5c1a1a] text-lg md:text-xl mt-5 font-display">will you be my valentine?</p>
                  <div className="flex justify-center gap-3 mt-4">
                    <span className="px-6 py-2 bg-[#5c1a1a] text-[#f5f0e8] rounded-sm text-sm font-medium">Yes</span>
                    <span className="px-6 py-2 border border-[#5c1a1a]/30 text-[#5c1a1a]/50 rounded-sm text-sm font-medium">No</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-300 text-sm text-center mt-4">{error}</p>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 text-[#f5f0e8]/60 hover:text-[#f5f0e8] transition-colors"
            >
              Back
            </button>
          )}

          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1 py-3 md:py-4 bg-[#f5f0e8] text-[#5c1a1a] rounded-sm font-medium hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading || !canProceed()}
              className="flex-1 py-3 md:py-4 bg-[#f5f0e8] text-[#5c1a1a] rounded-sm font-medium hover:bg-white transition-colors disabled:opacity-40 shadow-lg"
            >
              {isLoading ? 'Creating...' : 'Create card'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  const [showDemo, setShowDemo] = useState(true);
  const [hasSeenDemo, setHasSeenDemo] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('valentine-demo-seen');
    if (seen) {
      setShowDemo(false);
      setHasSeenDemo(true);
    }
  }, []);

  const completeDemo = () => {
    localStorage.setItem('valentine-demo-seen', 'true');
    setShowDemo(false);
    setHasSeenDemo(true);
  };

  const skipDemo = () => {
    localStorage.setItem('valentine-demo-seen', 'true');
    setShowDemo(false);
    setHasSeenDemo(true);
  };

  if (showDemo && !hasSeenDemo) {
    return <OnboardingDemo onComplete={completeDemo} onSkip={skipDemo} />;
  }

  return <CardForm />;
}
