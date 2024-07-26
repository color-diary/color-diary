export type ToastType = {
  label: string;
};

export type ToastContextType = {
  on: (toast: ToastType) => void;
};
