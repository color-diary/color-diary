'use client';

import { useEffect, useState } from 'react';

const useTypingWords = (text: string): string => {
  const [typing, setTyping] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const typingWords = setInterval(() => {
      if (typing.length === text.length) return;

      setTyping((prevTyping) => {
        const nextTyping = prevTyping ? prevTyping + text[count] : text[0];
        setCount(count + 1);

        return nextTyping;
      });
    }, 100);

    return () => clearInterval(typingWords);
  }, [count, text]);

  return typing;
};

export default useTypingWords;
