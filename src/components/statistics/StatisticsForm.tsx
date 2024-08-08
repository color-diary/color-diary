'use client';

import { kadvice, KadviceJsonModel } from 'kadvice';
import { useEffect, useState } from 'react';
import ColorChart from './ColorChart';
import EmotionChart from './EmotionChart';
import localFont from 'next/font/local';

const myFont = localFont({
  src: '../../fonts/BMJUA_otf.otf',
  display: 'swap'
});

const StatisticsForm = () => {
  const [advice, setAdvice] = useState<KadviceJsonModel | null>(null);

  useEffect(() => {
    const advice = kadvice.getOne();
    setAdvice(advice);
  }, []);

  if (!advice) {
    return null;
  }

  return (
    <div className="md:bg-[#FBF8F4] rounded-5xl w-744px-row md:h-916px-col flex items-center flex-col md:mt-128px-col mt-[94px] m-auto bg-[#FEFDFB] border-0 md:border-4 border-[#E6D3BC]">
      <div className="md:w-600px-row md:h-401px-col w-[335px] h-[240px] md:mt-56px-col">
        <h2 className="md:text-24px text-[18px] font-bold text-font-color">이달의 감정 색상</h2>
        <div className="flex md:mt-8px-col mt-2">
          <ColorChart />
          <div
            className={`md:w-160px-row md:h-160px-col md:mt-105px-col md:ml-12px-row md:px-12px-row md:py-12px-col text-16px md:inline hidden text-[#545454] ${myFont.className}`}
          >
            &quot;{advice.message}&quot;
          </div>
        </div>
      </div>
      <div className="md:w-600px-row md:h-354px-col md:mt-56px-col w-[335px] mt-6">
        <h2 className="md:text-24px font-bold md:mb-12px-col mb-[8px] text-[18px] text-font-color">이달의 내 감정</h2>
        <EmotionChart />
      </div>
      <div
        className={`md:hidden w-[330px] h-[44px] text-[16px] mt-[24px] text-center text-[#545454] ${myFont.className}`}
      >
        &quot;{advice.message}&quot;
      </div>
    </div>
  );
};

export default StatisticsForm;
