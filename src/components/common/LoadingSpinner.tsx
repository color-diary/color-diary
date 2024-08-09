import ReactLoading from 'react-loading';
import Character from './assets/Character';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center bg-layout gap-16px-col-m md:gap-16px-col">
      <div className="flex items-center justify-center">
        <div className="relative md:inline hidden">
          <ReactLoading
            type="spinningBubbles"
            color="#96C9F8"
            width={'calc(100vw * 0.1458)'}
            height={'calc(100vw * 0.1458)'}
          />
        </div>
        <div className="relative md:hidden inline">
          <ReactLoading
            type="spinningBubbles"
            color="#96C9F8"
            width={'calc(100vw * 0.448)'}
            height={'calc(100vw * 0.448)'}
          />
        </div>
        <Character />
      </div>
      <p className="text-center text-14px-m md:text-20px font-normal tracking-0.28px md:tracking-tight">
        당신의 감정을 위한 공간을 준비중이에요! 잠시만 기다려주세요.
      </p>
    </div>
  );
};

export default LoadingSpinner;
