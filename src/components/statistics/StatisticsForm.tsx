'use client';
import { kadvice, KadviceJsonModel } from 'kadvice';
import React, { useEffect, useState } from 'react';
import ColorChart from './ColorChart';
import EmotionChart from './EmotionChart';

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
    <div className="border-4 border-[#E6D3BC] bg-[#FBF8F4] rounded-5xl w-744px-row h-916px-col flex items-center flex-col mt-128px-col m-auto ">
      <div className="md:w-600px-row md:h-401px-col w-[335px] h-[240px] mt-56px-col">
        <h2 className="md:text-24px text-[18px] font-bold">이달의 감정 색상</h2>
        <div className="flex md:mt-8px-col mt-2">
          <ColorChart />
          <div className="md:w-160px-row md:h-160px-col md:mt-105px-col md:ml-12px-row md:px-12px-row md:py-12px-col text-16px md:inline hidden">
            {advice.message}
          </div>
        </div>
      </div>
      <div className="md:w-600px-row md:h-354px-col md:mt-56px-col w-[335px] h-[256px] mt-6">
        <h2 className="md:text-24px font-bold md:mb-12px-col text-[18px]">이달의 내 감정</h2>
        <EmotionChart />
      </div>
      <div className="md:hidden w-[335px] h-[44px] text-16px">{advice.message}</div>
    </div>
  );
};

export default StatisticsForm;
