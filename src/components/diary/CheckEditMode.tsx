'use client';

import useZustandStore from '@/zustand/zustandStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CheckEditMode = ({ children }: { children: React.ReactNode }) => {
  const { isDiaryEditMode } = useZustandStore();
  const router = useRouter();

  useEffect(() => {
    if (!isDiaryEditMode) {
      router.replace('/');
    }
  }, [isDiaryEditMode, router]);

  if (!isDiaryEditMode) {
    return null;
  }

  return <>{children}</>;
};

export default CheckEditMode;
