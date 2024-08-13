'use client';

import Toast from '@/components/common/modal/Toast';
import { ToastContextType, ToastType } from '@/types/modal.type';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

const initialValue: ToastContextType = {
  on: () => {}
};

const ToastContext = createContext(initialValue);

export const useToast = (): ToastContextType => useContext(ToastContext);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toast, setToast] = useState<ToastType | null>(null);

  const value: ToastContextType = {
    on: (message: ToastType) => {
      setToast(message);

      setTimeout(() => setToast(null), 1300);
    }
  };

  return (
    <ToastContext.Provider value={value}>
      {toast && <Toast toast={toast} />}
      {children}
    </ToastContext.Provider>
  );
}
