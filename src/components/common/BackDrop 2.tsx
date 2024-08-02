'use client';

import { PropsWithChildren, useEffect } from 'react';

const BackDrop = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex justify-center items-center bg-backdrop">
      {children}
    </div>
  );
};

export default BackDrop;
