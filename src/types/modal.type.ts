export type ToastType = {
  label: string;
};

export type ToastContextType = {
  on: (toast: ToastType) => void;
};

export type ModalButtonContentType = {
  children: string;
  icon?: JSX.Element;
};

export type ModalType = {
  label: string;
  onConfirm: () => void;
  onCancel?: () => void | null;
  isConfirmModal?: boolean;
  confirmButtonContent: ModalButtonContentType;
  cancelButtonContent?: ModalButtonContentType | null;
};

export type ModalContextType = {
  modal: ModalType | null;
  open: (modal: ModalType) => void;
  close: () => void;
};
