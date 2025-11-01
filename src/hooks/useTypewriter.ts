import { useEffect, useState, useRef } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  startDelay?: number;
  onComplete?: () => void;
}

interface UseTypewriterReturn {
  displayedText: string;
  isComplete: boolean;
}

export function useTypewriter({
  text,
  speed = 100,
  startDelay = 0,
  onComplete,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);

  // Update ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText('');
    setIsComplete(false);

    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout | undefined;
    let intervalId: NodeJS.Timeout | undefined;

    const startTyping = () => {
      intervalId = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          if (intervalId) clearInterval(intervalId);
          setIsComplete(true);
          onCompleteRef.current?.();
        }
      }, speed);
    };

    if (startDelay > 0) {
      timeoutId = setTimeout(() => {
        startTyping();
      }, startDelay);
    } else {
      startTyping();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayedText, isComplete };
}
