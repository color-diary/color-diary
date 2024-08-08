import HomeIconWhite from '@/components/common/assets/HomeIconWhite';
import Logo from '@/components/common/assets/Logo';
import NotFoundText from '@/components/common/assets/NotFoundText';
import Button from '@/components/common/Button';
import { splitCommentWithSlash } from '@/utils/splitCommentWithSlash';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="w-64px-row-m h-28px-col-m md:w-168px-row md:h-74px-col flex items-center justify-center">
        <NotFoundText />
      </div>
      <div className="flex flex-col items-center self-stretch gap-24px-col-m md:gap-24px-col">
        <div className="w-196px-row-m h-56px-col-m md:w-394px-row md:h-112px-col flex items-center justify-center">
          <Logo />
        </div>
        <div className="text-font-color text-12px-m md:text-18px text-center font-normal tracking-0.24px md:tracking-0.36px">
          {splitCommentWithSlash(
            '죄송합니다. 입력한 주소가 잘못되어 페이지를 불러 올 수 없어요./홈페이지로 이동하시겠어요?'
          ).map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <Button href="/" size={'lg'} icon={<HomeIconWhite />}>
          홈페이지로 이동하기
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
