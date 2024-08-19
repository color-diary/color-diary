'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import LandingIcon from './assets/LandingIcon';

const Landing = ({
  children
}: Readonly<{
  children: PropsWithChildren;
}>) => {
  const [isLanding, setIsLanding] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLanding(false);
    }, 500);
  }, []);

  return (
    <>
      {isLanding ? (
        <div className="z-50 absolute top-0 w-screen h-screen bg-[#FEFDFB] flex flex-col justify-center items-center">
          <div className="w-[86px] h-[92px] md:w-[144px] md:h-[176px] animate-[jump_1s_ease-in-out_infinite]">
            <LandingIcon />
          </div>
          <p className="mt-16px-col-m md:mt-32px-col text-14px-m md:text-20px">
            안녕하세요. 우리 함께 4계절의 감정을 기록해 볼까요?
          </p>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default Landing;
