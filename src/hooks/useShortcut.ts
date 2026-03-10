import { useEffect, useRef } from 'react';

export function useShortcut(key: string, count: number, onTrigger: () => void) {
  const pressCount = useRef(0);
  const lastPressTime = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === key) {
        const now = Date.now();
        // Reset if more than 2 seconds between presses
        if (now - lastPressTime.current > 2000) {
          pressCount.current = 1;
        } else {
          pressCount.current += 1;
        }
        
        lastPressTime.current = now;

        if (pressCount.current >= count) {
          pressCount.current = 0;
          onTrigger();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, count, onTrigger]);
}
