'use client';

import useTypingWords from '@/hooks/useTypingWords';
import { useEffect } from 'react';
import Character from './assets/Character';
import Spinner from './assets/Spinner';

const LoadingSpinner: React.FC = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const loadingText = '당신의 감정을 위한 공간을 준비중이에요! 잠시만 기다려주세요.';
  const typingText = useTypingWords(loadingText);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center bg-layout gap-16px-col-m md:gap-16px-col">
      <div className="flex items-center justify-center">
        <div className="relative md:inline-flex hidden">
          <span className="loader">
            <Spinner />
          </span>
        </div>
        <div className="relative md:hidden inline-flex">
          <span className="loader-mobile">
            <Spinner />
          </span>
        </div>
        <Character />
      </div>
      <div className="flex items-center">
        <p className="relative text-layout text-start text-14px-m md:text-20px font-normal tracking-0.28px md:tracking-tight">
          {loadingText}
        </p>
        <p className="absolute text-start text-14px-m md:text-20px font-normal tracking-0.28px md:tracking-tight">
          {typingText}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
