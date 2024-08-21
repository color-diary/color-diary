'use client';

import { useSearchParams } from 'next/navigation';

const useGetInitialValue = () => {
  const today = new Date();
  const searchParams = useSearchParams();

  const newDate = new Date(
    Number(searchParams.get('YYMM')?.slice(0, 4)),
    Number(searchParams.get('YYMM')?.slice(4, 6)) - 1,
    1
  );

  const getInitialValue = (type: string) => {
    if (type === 'date') {
      return searchParams.get('YYMM') ? newDate : today;
    }
    if (type === 'form') {
      return searchParams.get('form') ? searchParams.get('form') : 'calendar';
    }
  };

  return getInitialValue;
};

export default useGetInitialValue;
