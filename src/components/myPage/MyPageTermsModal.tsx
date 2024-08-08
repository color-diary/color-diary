import Button from '../common/Button';
import MyPageTerms from './MyPageTerms';
import { Exit } from './svg/Exit';
import { TermsExit } from './svg/TermsExit';

interface TermsModalProps {

  onClose: () => void;
}

const MyPageTermsModal = ({ onClose }: TermsModalProps) => {
  return (
    <div className="flex flex-col  md:justify-center items-center gap-32px-col px-4 py-6 md:px-96px-row md:py-72px-col rounded-5xl bg-sign-up border-4 border-border-color">
      
      <div className='flex flex-col self-stretch'>
      <span onClick={()=>onClose()} className='flex flex-col items-end self-stretch'><TermsExit /></span>
      <h1 className="flex justify-center text-font-color text-[18px] md:text-24px font-bold tracking-0.48px">Color Inside 서비스 이용약관</h1>
      </div>

      <div className="w-full md:w-540px-row h-560px-col overflow-y-scroll small-custom-terms-scrollbar">{MyPageTerms}</div>
      <div className="w-full flex items-end justify-end self-stretch ">
        <Button
          size={'lg'}
          onClick={onClose}
          icon={<Exit />}
        >
          이용약관 닫기
        </Button>
      </div>
    </div>
  );
};

export default MyPageTermsModal;
