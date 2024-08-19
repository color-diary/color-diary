'use client';

import useZustandStore from '@/zustand/zustandStore';
import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';

const CheckEditMode = ({ children }: { children: PropsWithChildren }) => {
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
