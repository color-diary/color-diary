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
    <div className="border-4 border-[#E6D3BC] bg-[#FBF8F4] rounded-5xl w-744px-row h-916px-col flex items-center flex-col mt-128px-col mb-76px-col m-auto ">
      <div className="w-600px-row h-401px-col mt-56px-col">
        <h2 className="text-24px font-bold">이달의 감정 색상</h2>
        <div className="flex mt-8px-col">
          <ColorChart />
          <div className="w-160px-row h-160px-col mt-105px-col ml-12px-row px-12px-row py-12px-col text-16px">
            {advice.message}
          </div>
        </div>
      </div>
      <div className="w-600px-row h-354px-col mt-56px-col">
        <h2 className="text-24px font-bold mb-12px-col">이달의 내 감정</h2>
        <EmotionChart />
      </div>
    </div>
  );
};

export default StatisticsForm;
