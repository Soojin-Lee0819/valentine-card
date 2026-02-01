'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Onboarding Demo Component
function OnboardingDemo({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  const [step, setStep] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const [attempts, setAttempts] = useState(0);

  const escapeNo = useCallback(() => {
    setAttempts(prev => prev + 1);
    if (attempts < 2) {
      setNoScale(prev => prev * 0.7);
    } else {
      setNoPosition({
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 80,
      });
      setNoScale(prev => Math.max(prev * 0.9, 0.4));
    }
  }, [attempts]);

  const resetDemo = () => {
    setNoPosition({ x: 0, y: 0 });
    setNoScale(1);
    setAttempts(0);
  };

  const steps = [
    {
      title: "Here's how it works",
      content: (
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            You write a heartfelt message, and we'll create a beautiful card with a little twist...
          </p>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-sm mx-auto">
            <p className="text-sm text-gray-400 mb-2">Preview</p>
            <p className="font-handwritten text-2xl text-gray-700">
              "Every moment with you feels like magic..."
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "The fun part",
      content: (
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            When they try to click "No"... well, let's just say it's not that easy.
          </p>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 relative overflow-hidden min-h-[140px]">
            <p className="text-sm text-gray-400 mb-4">Try hovering over "No"</p>
            <div className="flex justify-center items-center gap-4 relative">
              <button className="px-6 py-2.5 bg-[#c45c5c] text-white rounded-full text-sm font-medium">
                Yes
              </button>
              <button
                onMouseEnter={escapeNo}
                onTouchStart={escapeNo}
                style={{
                  transform: `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale})`,
                  transition: 'transform 0.2s ease-out',
                }}
                className="px-6 py-2.5 bg-gray-200 text-gray-500 rounded-full text-sm font-medium"
              >
                No
              </button>
            </div>
            {attempts > 2 && (
              <button
                onClick={resetDemo}
                className="absolute bottom-2 right-2 text-xs text-gray-400 hover:text-gray-600"
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-gray-800 mb-2">{steps[step].title}</h1>
          <div className="flex justify-center gap-1.5 mt-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === step ? 'bg-[#c45c5c]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">{steps[step].content}</div>

        <div className="flex flex-col gap-3">
          {step < steps.length - 1 ? (
            <>
              <button
                onClick={() => { resetDemo(); setStep(step + 1); }}
                className="w-full py-3 bg-[#c45c5c] text-white rounded-full font-medium hover:bg-[#b54d4d] transition-colors"
              >
                Next
              </button>
              <button
                onClick={onSkip}
                className="w-full py-3 text-gray-400 hover:text-gray-600 transition-colors text-sm"
              >
                Skip intro
              </button>
            </>
          ) : (
            <button
              onClick={onComplete}
              className="w-full py-3 bg-[#c45c5c] text-white rounded-full font-medium hover:bg-[#b54d4d] transition-colors"
            >
              Create my card
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Card Creation Form
function CardForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('senderName', senderName);
      formData.append('recipientName', recipientName);
      formData.append('message', message);
      if (image) {
        formData.append('image', image);
      }

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  s <= step
                    ? 'bg-[#c45c5c] text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 sm:w-24 h-0.5 mx-2 transition-colors ${
                    s < step ? 'bg-[#c45c5c]' : 'bg-gray-100'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Names */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <h1 className="font-display text-3xl text-gray-800 text-center mb-2">
              Who's this card for?
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Let's start with the basics
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c45c5c] focus:ring-1 focus:ring-[#c45c5c] focus:outline-none transition-colors bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Their name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Enter their name"
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c45c5c] focus:ring-1 focus:ring-[#c45c5c] focus:outline-none transition-colors bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Message */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <h1 className="font-display text-3xl text-gray-800 text-center mb-2">
              Write your message
            </h1>
            <p className="text-gray-500 text-center mb-8">
              What do you want to say to {recipientName}?
            </p>

            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write something from the heart..."
                maxLength={500}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#c45c5c] focus:ring-1 focus:ring-[#c45c5c] focus:outline-none transition-colors resize-none bg-white"
              />
              <p className="text-xs text-gray-400 mt-2 text-right">
                {message.length}/500
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Photo (optional) */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <h1 className="font-display text-3xl text-gray-800 text-center mb-2">
              Add a photo?
            </h1>
            <p className="text-gray-500 text-center mb-8">
              This will be revealed when they say yes (optional)
            </p>

            {imagePreview ? (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-2xl border-2 border-gray-100"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-gray-800 text-white rounded-full text-sm hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-[#c45c5c] hover:bg-red-50/30 transition-colors">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Click to upload a photo</p>
                  <p className="text-gray-400 text-sm mt-1">Max 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1 py-3 bg-[#c45c5c] text-white rounded-full font-medium hover:bg-[#b54d4d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 py-3 bg-[#c45c5c] text-white rounded-full font-medium hover:bg-[#b54d4d] transition-colors disabled:opacity-40"
            >
              {isLoading ? 'Creating...' : 'Create card'}
            </button>
          )}
        </div>

        {step === 3 && !image && (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full mt-3 py-3 text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            Skip photo
          </button>
        )}
      </div>
    </div>
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
