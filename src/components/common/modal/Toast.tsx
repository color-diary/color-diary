'use client';

import { ToastType } from '@/types/modal.type';
import { cva, VariantProps } from 'class-variance-authority';
import { useEffect, useState } from 'react';

const alertVariant = cva(
  'inline-flex justify-center items-center bg-toast text-white rounded-lg font-normal transition-opacity duration-500',
  {
    variants: {
      device: {
        desktop: 'px-6 py-4 text-xl',
        mobile: 'px-4 py-3 text-sm'
      },
      isOpen: {
        true: 'opacity-100',
        false: 'opacity-0'
      }
    },
    defaultVariants: {
      device: 'desktop',
      isOpen: false
    }
  }
);

type ToastVariantProps = VariantProps<typeof alertVariant>;

type ToastProps = {
  toast: ToastType;
} & ToastVariantProps;

const Toast = ({ toast, device }: ToastProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsOpen(true);
    setTimeout(() => setIsOpen(false), 1000 - 500);
  }, []);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex justify-center items-center">
      <div className={alertVariant({ device, isOpen })}>{toast.label}</div>
    </div>
  );
};

export default Toast;
