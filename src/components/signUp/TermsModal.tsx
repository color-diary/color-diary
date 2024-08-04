import terms from '@/data/terms';
import Button from '../common/Button';

interface TermsModalProps {
  isTermsChecked: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const TermsModal = ({ isTermsChecked, onConfirm, onCancel }: TermsModalProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-32px-col px-96px-row py-72px-col rounded-5xl bg-sign-up border-4 border-border-color">
      <h1 className="text-font-color text-24px font-bold tracking-0.48px">Color Inside 서비스 이용약관</h1>
      <div className="w-540px-row h-560px-col overflow-y-scroll custom-terms-scrollbar">{terms}</div>
      <div className="w-full flex items-end justify-end self-stretch gap-16px-row">
        <Button
          size={'lg'}
          priority={'secondary'}
          onClick={onCancel}
          icon={
            isTermsChecked ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" fill="white" />
                <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke="#A1A1A1" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_2226_11984)">
                  <rect x="2" y="2" width="20" height="20" rx="4" fill="white" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.2893 6.53072C19.8246 6.96662 19.9052 7.75396 19.4693 8.2893L11.734 17.7893C11.5017 18.0746 11.1556 18.243 10.7878 18.2498C10.4199 18.2566 10.0678 18.101 9.82514 17.8245L4.56044 11.8245C4.10512 11.3056 4.15667 10.5158 4.67558 10.0605C5.1945 9.60514 5.98427 9.65669 6.4396 10.1756L10.729 15.0641L17.5307 6.71078C17.9666 6.17544 18.7539 6.09483 19.2893 6.53072Z"
                    fill="#25B18C"
                  />
                </g>
                <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke="#25B18C" />
                <defs>
                  <clipPath id="clip0_2226_11984">
                    <rect x="2" y="2" width="20" height="20" rx="4" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            )
          }
        >
          동의하지 않습니다.
        </Button>
        <Button
          size={'lg'}
          onClick={onConfirm}
          icon={
            isTermsChecked ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_2226_11984)">
                  <rect x="2" y="2" width="20" height="20" rx="4" fill="white" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M19.2893 6.53072C19.8246 6.96662 19.9052 7.75396 19.4693 8.2893L11.734 17.7893C11.5017 18.0746 11.1556 18.243 10.7878 18.2498C10.4199 18.2566 10.0678 18.101 9.82514 17.8245L4.56044 11.8245C4.10512 11.3056 4.15667 10.5158 4.67558 10.0605C5.1945 9.60514 5.98427 9.65669 6.4396 10.1756L10.729 15.0641L17.5307 6.71078C17.9666 6.17544 18.7539 6.09483 19.2893 6.53072Z"
                    fill="#25B18C"
                  />
                </g>
                <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke="#25B18C" />
                <defs>
                  <clipPath id="clip0_2226_11984">
                    <rect x="2" y="2" width="20" height="20" rx="4" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" fill="white" />
                <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke="#A1A1A1" />
              </svg>
            )
          }
        >
          동의합니다.
        </Button>
      </div>
    </div>
  );
};

export default TermsModal;
