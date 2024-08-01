import { ModalType } from '@/types/modal.type';
import { splitCommentWithSlash } from '@/utils/splitCommentWithSlash';
import { cva, VariantProps } from 'class-variance-authority';
import BackDrop from '../BackDrop';
import Button from '../Button';

const modalVariant = cva('inline-flex flex-col items-start bg-white rounded-2xl', {
  variants: {
    device: {
      desktop: 'px-24px-row py-24px-col gap-32px-col',
      mobile: 'px-16px-row py-16px-col gap-16px-col'
    }
  },
  defaultVariants: {
    device: 'desktop'
  }
});

const textVariant = cva('text-modal-font-color font-normal', {
  variants: {
    device: {
      desktop: 'text-24px tracking-0.48px',
      mobile: 'text-16px tracking-0.32px'
    }
  },
  defaultVariants: {
    device: 'desktop'
  }
});

type ModalVariantProps = VariantProps<typeof modalVariant>;

type ModalProps = {
  modal: ModalType;
} & ModalVariantProps;

const Modal = ({ modal, device }: ModalProps) => {
  const { label, onConfirm, onCancel, isConfirmModal = true, confirmButtonContent, cancelButtonContent } = modal;

  const size = device === 'mobile' ? 'sm' : 'lg';

  return (
    <BackDrop>
      <div className={modalVariant({ device })}>
        <div className={textVariant({ device })}>
          {splitCommentWithSlash(label).map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        {isConfirmModal && cancelButtonContent ? (
          <div className="flex items-start gap-12px-row">
            <Button onClick={onConfirm} size={size} priority={'secondary'} icon={confirmButtonContent.icon || null}>
              {confirmButtonContent.children}
            </Button>
            <Button onClick={onCancel} size={size} icon={cancelButtonContent.icon || null}>
              {cancelButtonContent.children}
            </Button>
          </div>
        ) : (
          <Button onClick={onConfirm} size={size} icon={confirmButtonContent.icon || null}>
            {confirmButtonContent.children}
          </Button>
        )}
      </div>
    </BackDrop>
  );
};

export default Modal;
