import ReactLoading from 'react-loading';
import Character from './assets/Character';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center bg-layout">
      <div className="md:inline hidden">
        <ReactLoading
          type="spinningBubbles"
          color="#96C9F8"
          width={'calc(100vw * 0.1458)'}
          height={'calc(100vw * 0.1458)'}
        />
      </div>
      <div className="md:hidden inline">
        <ReactLoading
          type="spinningBubbles"
          color="#96C9F8"
          width={'calc(100vw * 0.448)'}
          height={'calc(100vw * 0.448)'}
        />
      </div>
      <Character />
    </div>
  );
};

export default LoadingSpinner;
