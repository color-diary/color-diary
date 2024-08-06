import { ModalType } from '@/types/modal.type';
import { splitCommentWithSlash } from '@/utils/splitCommentWithSlash';
import BackDrop from '../BackDrop';
import Button from '../Button';

type ModalProps = {
  modal: ModalType;
};

const Modal = ({ modal }: ModalProps) => {
  const { label, onConfirm, onCancel, isConfirmModal = true, confirmButtonContent, cancelButtonContent } = modal;

  return (
    <BackDrop>
      <div className="inline-flex flex-col items-start bg-white rounded-2xl md:px-24px-row md:py-24px-col md:gap-32px-col px-4 py-4 gap-4">
        <div className="text-modal-font-color font-normal md:text-20px md:tracking-tight text-base tracking-0.32px">
          {splitCommentWithSlash(label).map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        {isConfirmModal && cancelButtonContent ? (
          <div className="flex items-start md:gap-12px-row gap-3">
            <Button onClick={onConfirm} size={'lg'} priority={'secondary'} icon={confirmButtonContent.icon || null}>
              {confirmButtonContent.children}
            </Button>
            <Button onClick={onCancel} size={'lg'} icon={cancelButtonContent.icon || null}>
              {cancelButtonContent.children}
            </Button>
          </div>
        ) : (
          <Button onClick={onConfirm} size={'lg'} icon={confirmButtonContent.icon || null}>
            {confirmButtonContent.children}
          </Button>
        )}
      </div>
    </BackDrop>
  );
};

export default Modal;
