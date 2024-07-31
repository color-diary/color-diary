'use client';

import Modal from '@/components/common/modal/Modal';
import { ModalContextType, ModalType } from '@/types/modal.type';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

const initialValue: ModalContextType = {
  modal: null,
  open: () => {},
  close: () => {}
};

const ModalContext = createContext(initialValue);

export const useModal = (): ModalContextType => useContext(ModalContext);

export function ModalProvider({ children }: PropsWithChildren) {
  const [modalOptions, setModalOptions] = useState<ModalType | null>(null);

  const value: ModalContextType = {
    modal: modalOptions,
    open: (modal: ModalType) => setModalOptions(modal),
    close: () => setModalOptions(null)
  };

  return (
    <ModalContext.Provider value={value}>
      {modalOptions && <Modal modal={modalOptions} />}
      {children}
    </ModalContext.Provider>
  );
}
