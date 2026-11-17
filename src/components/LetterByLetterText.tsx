import React, { useState, useEffect } from 'react';

interface LetterByLetterTextProps {
  text: string;
  speedMs?: number;
  className?: string;
  cursor?: boolean;
  onComplete?: () => void;
}

export const LetterByLetterText: React.FC<LetterByLetterTextProps> = ({
  text,
  speedMs = 22,
  className = '',
  cursor = false,
  onComplete
}) => {
  const [displayedLength, setDisplayedLength] = useState<number>(0);

  useEffect(() => {
    setDisplayedLength(0);
    if (!text) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      setDisplayedLength(currentIndex);
      if (currentIndex >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speedMs);

    return () => clearInterval(interval);
  }, [text, speedMs, onComplete]);

  return (
    <span className={className}>
      {text.slice(0, displayedLength)}
      {cursor && displayedLength < text.length && (
        <span className="inline-block w-0.5 h-[0.9em] bg-[#d4f15d] align-middle ml-0.5" />
      )}
    </span>
  );
};
