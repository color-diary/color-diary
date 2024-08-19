'use client';

import { Diary } from '@/types/diary.type';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const EmotionChart = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const changeDate = (changeMonth: number) => {
    if (changeMonth === 0) {
      changeMonth = 12;
      setYear(year - 1);
    } else if (changeMonth === 13) {
      changeMonth = 1;
      setYear(year + 1);
    }
    setMonth(changeMonth);
  };

  const { data: diaries = [], isPending } = useQuery({
    queryKey: ['statisticsDiary', year, month],
    queryFn: async () => {
      const response = await axios.get<Diary[]>(`/api/diaries?year=${year}&month=${month}`);
      const diaries = response.data;
      return diaries;
    }
  });

  if (isPending) {
    return <LoadingSpinner />;
  }

  const allTags = diaries.flatMap((entry) => entry.tags);
  const counts = allTags.reduce<Record<string, number>>((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  const sortedTagEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const sortedTags = sortedTagEntries.map((entry) => entry[0]);
  const tagCounts = sortedTagEntries.map((entry) => entry[1]);

  let sum = 0;
  tagCounts.forEach((item) => {
    sum += item;
  });

  const maxCount = tagCounts[0];
  const newProgresses = tagCounts.slice(0, 3).map((count) => (count / maxCount) * 100);
  const progresses = tagCounts.length > 0 ? newProgresses : [0, 0, 0];

  const chartData = [];
  for (let i = 0; i < Math.min(sortedTags.length, 3); i++) {
    chartData.push({ tag: sortedTags[i] });
  }

  const backgroundColor = ['bg-[#EEE2D2]', 'bg-[#F4EBE1]', 'bg-[#F9F5F0]'];

  return (
    <div className="flex flex-col items-center md:w-600px-row md:h-304px-col w-[335px] border rounded-5xl border-[#E6D3BC] bg-white pb-[24px]">
      <div className="flex items-center justify-center md:gap-12px-row md:text-20px md:mt-24px-col mt-[16px] gap-[8px] text-[16px] text-font-color">
        <button onClick={() => changeDate(month - 1)}>&lt;</button>
        {year}.{month}
        <button onClick={() => changeDate(month + 1)}>&gt;</button>
      </div>

      {sortedTags.length > 0 ? (
        (tagCounts[0] / tagCounts.length) * 100 < 3 ? (
          <div className="flex flex-col items-center md:mt-24px-col mt-[24px]">
            <Image
              src="/Seasons.svg"
              alt="사계절 이미지"
              width={282}
              height={50}
              className="md:w-282px-row md:h-50px-colx md:mb-16px-col w-[232px] h-[40px] mb-[16px]"
            />
            <div className="md:text-16px text-[12px] text-font-color">다양한 감정을 느끼신 것 같아요.</div>
            <div className="md:text-16px text-[12px] text-font-color">
              다양한 감정이 동일한 빈도로 나타내고 있어 통계를 제공할 수 없어요.
            </div>
            <div className="md:text-16px text-[12px] text-font-color">하지만 감정을 기록하는 건 좋은 습관입니다.</div>
            <div className="text-[#25B18C] md:text-20px text-[14px] md:mt-24px-col mt-[16px] mb-[24px]">
              #다양한_감정의_주인공은_바로_나
            </div>
          </div>
        ) : (
          <div className="flex flex-row mt-24px-col md:h-200px-col h-[136px] gap-[7.5px]">
            <div className="flex flex-col md:gap-16px-col md:py-24px-col md:h-200px-col gap-[16px] py-[16px] h-[136px]">
              {chartData.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="relative flex items-center text-start w-[50px] md:h-40px-col md:w-70px-row h-[24px]"
                  >
                    <span className="md:text-18px text-[14px] w-full truncate text-font-color hover:whitespace-normal hover:overflow-visible hover:absolute hover:bg-white">
                      #{item.tag}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col border-l-2 border-[#33D4AA] md:gap-16px-col md:py-24px-col py-[16px] gap-[16px]">
              {progresses.map((item, index) => {
                return (
                  <div key={index} className="flex items-center w-full">
                    <div className="relative md:h-40px-col h-[24px] flex self-stretch rounded-lg md:w-310px-row w-[204px]">
                      <div
                        className={`flex justify-end absolute top-0 left-0 md:h-40px-col h-[24px] ${backgroundColor[index]} border-[#33D4AA] border-[1.5px] border-dashed border-l-0 rounded-e-xl transition-all duration-300`}
                        style={{ width: `${item}%` }}
                      >
                        <div className="text-center text-[#25B18C] md:text-14px text-[12px] bg-white rounded-3xl md:py-4px-col py-[2px] md:px-8px-row px-[6px] absolute right-13.5px-row transform -translate-y-1/2 top-1/2">
                          {tagCounts[index]}개
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        <div className="md:mt-64px-col mt-[24px] flex flex-col items-center">
          <div className="text-[#25B18C] md:text-20px text-[14px]">#이달은_감정기록이_필요해</div>
          <div className="md:mt-16px-col md:text-16px mt-[16px] text-[12px] text-font-color">
            아직 감정 해시태그가 기록되지 않았어요.
          </div>
          <div className="md:text-16px text-[12px] text-font-color">
            감정 해시태그를 추가하면 자기 이해와 관리에 도움이 될 수 있답니다.
          </div>
          <div className="md:text-16px text-[12px] mb-[24px] text-font-color">
            오늘의 감정을 해시태그로 표현해보세요!
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionChart;
