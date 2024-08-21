import terms from '@/data/terms';
import Button from '../common/Button';
import CheckFalse from './assets/CheckFalse';
import CheckTrue from './assets/CheckTrue';

interface TermsModalProps {
  isTermsChecked: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const TermsModal = ({ isTermsChecked, onConfirm, onCancel }: TermsModalProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-24px-col-m md:gap-32px-col pt-16px-col-m pb-24px-col-m px-16px-row-m md:px-96px-row md:py-72px-col rounded-2xl md:rounded-5xl bg-sign-up border-2 md:border-4 border-border-color">
      <h1 className="text-font-color text-18px-m md:text-24px font-bold tracking-0.48px">
        Color Inside 서비스 이용약관
      </h1>
      <div className="w-300px-row-m h-360px-col-m md:w-540px-row md:h-560px-col overflow-y-scroll custom-terms-scrollbar-mobile md:custom-terms-scrollbar pr-3">
        {terms}
      </div>
      <div className="w-full flex items-end justify-end self-stretch mt-16px-col-m md:mt-0 gap-16px-row-m md:gap-16px-row">
        <Button
          size={'lg'}
          priority={'secondary'}
          onClick={onCancel}
          icon={isTermsChecked ? <CheckFalse /> : <CheckTrue />}
        >
          동의하지 않습니다.
        </Button>
        <Button size={'lg'} onClick={onConfirm} icon={isTermsChecked ? <CheckTrue /> : <CheckFalse />}>
          동의합니다.
        </Button>
      </div>
    </div>
  );
};

export default TermsModal;
