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
    <div className="border rounded-3xl w-[744px] h-[916px] flex items-center flex-col mt-[56px] mb-[76px] m-auto gap-9">
      <div className="w-[600px] h-[354px] mt-[56px]">
        <h2 className="text-2xl font-bold">이달의 감정 색상</h2>
        <div className="flex mt-4">
          <ColorChart />
          <div className="w-[182px] mt-[95px] ml-3 p-3">{advice.message}</div>
        </div>
      </div>
      <div className="w-[600px] h-[354px] mt-12">
        <h2 className="text-2xl font-bold mb-3">이달의 내 감정</h2>
        <EmotionChart />
      </div>
    </div>
  );
};

export default StatisticsForm;
