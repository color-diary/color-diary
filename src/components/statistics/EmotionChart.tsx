'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Diary } from '@/types/diary.type';
import Image from 'next/image';

const EmotionChart = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [sortedTags, setSortedTags] = useState<string[]>([]);
  const [tagCounts, setTagCounts] = useState<number[]>([]);
  const [progresses, setProgresses] = useState<number[]>([]);

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

  useEffect(() => {
    const getDiaries = async () => {
      try {
        const response = await axios.get<Diary[]>(`/api/diaries?year=${year}&month=${month}`);
        const diaries = response.data;
        const allTags = diaries.flatMap((entry) => entry.tags);
        const counts = allTags.reduce<Record<string, number>>((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {});

        const sortedTagEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

        setSortedTags(sortedTagEntries.map((entry) => entry[0]));
        setTagCounts(sortedTagEntries.map((entry) => entry[1]));
      } catch (error) {
        console.error('Error fetching diaries:', error);
      }
    };
    getDiaries();
  }, [year, month]);

  let sum = 0;
  tagCounts.forEach((item) => {
    sum += item;
  });

  useEffect(() => {
    if (tagCounts.length > 0) {
      const maxCount = tagCounts[0];
      const newProgresses = tagCounts.slice(0, 3).map((count) => (count / maxCount) * 100);
      setProgresses(newProgresses);
    } else {
      setProgresses([0, 0, 0]);
    }
  }, [tagCounts]);

  const chartData = [];
  for (let i = 0; i < Math.min(sortedTags.length, 3); i++) {
    chartData.push({ tag: sortedTags[i] });
  }

  return (
    <div className="flex flex-col items-center w-600px-row h-304px-col border rounded-5xl border-[#E6D3BC] bg-white">
      <div className="flex items-center justify-center gap-12px-row text-20px mt-24px-col">
        <button onClick={() => changeDate(month - 1)}>&lt;</button>
        {year}.{month}
        <button onClick={() => changeDate(month + 1)}>&gt;</button>
      </div>

      {sortedTags.length > 0 ? (
        (tagCounts[0] / tagCounts.length) * 100 < 3 ? (
          <div className="flex flex-col items-center mt-24px-col">
            <Image
              src="/seasons.png"
              alt="사계절 이미지"
              width={282}
              height={50}
              className="w-282px-row h-50px-colx mb-16px-col"
            />
            <div className="text-16px">다양한 감정을 느끼신 것 같아요.</div>
            <div className="text-16px">다양한 감정이 동일한 빈도로 나타내고 있어 통계를 제공할 수 없어요.</div>
            <div className="text-16px">하지만 감정을 기록하는 건 좋은 습관입니다.</div>
            <div className="text-[#25B18C] text-20px mt-24px-col">#다양한_감정의_주인공은_바로_나</div>
          </div>
        ) : (
          <div className="flex flex-row mt-24px-col h-200px-col gap-[7.5px]">
            <div className="flex flex-col gap-16px-col py-24px-col h-200px-col">
              {chartData.map((item, index) => {
                return (
                  <div key={index} className="flex items-center text-end w-60px-row h-40px-col">
                    <span className="text-18px w-full truncate">{item.tag}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col border-l-2 border-[#25B18C] gap-16px-col py-24px-col">
              {progresses.map((item, index) => {
                return (
                  <div key={index} className="flex items-center w-full">
                    <div className="relative h-40px-col flex self-stretch rounded-lg w-310px-row">
                      <div
                        className="flex justify-end absolute top-0 left-0 h-40px-col bg-[#F4EBE1] border-l-0 border-dashed border-2 border-[#25B18C] rounded-e-2xl transition-all duration-300"
                        style={{ width: `${progresses[index]}%` }}
                      >
                        <div className="text-center text-[#25B18C] text-14px bg-white rounded-3xl py-4px-col px-8px-row absolute right-13.5px-row transform -translate-y-1/2 top-1/2">
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
        <div className="mt-64px-col flex flex-col items-center">
          <div className="text-[#25B18C] text-20px">#이달은_감정기록이_필요해</div>
          <div className="mt-16px-col text-16px">아직 감정 해시태그가 기록되지 않았어요.</div>
          <div className="text-16px">감정 해시태그를 추가하면 자기 이해와 관리에 도움이 될 수 있답니다.</div>
          <div className="text-16px">오늘의 감정을 해시태그로 표현해보세요!</div>
        </div>
      )}
    </div>
  );
};

export default EmotionChart;
