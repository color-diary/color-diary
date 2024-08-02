'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from '../ui/calendar';
import { DiaryList } from '@/types/diary.type';
import { formatFullDate } from '@/utils/dateUtils';

interface CardsProps {
  isCalendar: boolean;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  handleInputDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  diaryList: DiaryList;
}

const Cards = ({ diaryList, isCalendar, date, setDate, handleInputDate }: CardsProps) => {
  const route = useRouter();
  const today = new Date();

  diaryList.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    } else {
      return 1;
    }
  });

  return (
    <div className="flex flex-col">
      <div className="mb-40px-col">
        <Calendar
          isCalendar={isCalendar}
          diaryList={diaryList}
          month={date}
          onMonthChange={setDate}
          handleInputDate={handleInputDate}
        />
      </div>
      {diaryList.length === 0 ? (
        <p>일기가 아직 작성되지 않았습니다.</p>
      ) : (
        <div className="flex grid md:grid-cols-4 grid-cols-2 gap-[16px] md:gap-x-24px-row md:gap-y-24px-col gap-x-3 gap-y-4">
          {diaryList.map((diary) => {
            return (
              <div
                key={diary.diaryId}
                onClick={() => {
                  route.push(`/diaries/${diary.diaryId}`);
                }}
                className="border md:border-2 border-[#E6D3BC] md:rounded-3xl rounded-xl overflow-hidden cursor-pointer w-[160px]"
                style={{ backgroundColor: `${diary.color}` }}
              >
                <div className="flex justify-between text-sm bg-white md:px-24px-row md:py-8px-col px-4 py-2">
                  <div className="text-12px-m md:text-16px mr-1">{new Date(diary.date).getDate()}</div>
                  <div className="text-ellipsis whitespace-nowrap overflow-hidden text-12px-m md:text-14px">
                    {diary.tags[0]}
                  </div>
                </div>
                <div className="h-64px-col"></div>
              </div>
            );
          })}
          {/*!isTodayWritten && (
            <div
              onClick={() => {
                route.push(`/diaries/write/${formatFullDate(String(today))}`);
              }}
              className="border md:border-2 border-[#E6D3BC] md:rounded-3xl rounded-lg overflow-hidden min-w-[68px] bg-white shadow-[0_0_5px_0_#F1A027] cursor-pointer"
            >
              <div className="flex justify-between text-sm bg-white md:px-24px-row md:py-8px-col px-2 py-1">
                <div className="text-12px-m md:text-16px">{today.getDate()}</div>
              </div>
              <div className="flex justify-center items-center pt-[4px] pb-[12px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M11.9999 3C11.9999 2.84087 11.9367 2.68826 11.8242 2.57574C11.7116 2.46322 11.559 2.4 11.3999 2.4C11.2408 2.4 11.0882 2.46322 10.9756 2.57574C10.8631 2.68826 10.7999 2.84087 10.7999 3V10.8H2.9999C2.84077 10.8 2.68816 10.8632 2.57564 10.9757C2.46312 11.0883 2.3999 11.2409 2.3999 11.4C2.3999 11.5591 2.46312 11.7117 2.57564 11.8243C2.68816 11.9368 2.84077 12 2.9999 12H10.7999V19.8C10.7999 19.9591 10.8631 20.1117 10.9756 20.2243C11.0882 20.3368 11.2408 20.4 11.3999 20.4C11.559 20.4 11.7116 20.3368 11.8242 20.2243C11.9367 20.1117 11.9999 19.9591 11.9999 19.8V12H19.7999C19.959 12 20.1116 11.9368 20.2242 11.8243C20.3367 11.7117 20.3999 11.5591 20.3999 11.4C20.3999 11.2409 20.3367 11.0883 20.2242 10.9757C20.1116 10.8632 19.959 10.8 19.7999 10.8H11.9999V3Z"
                    fill="#080808"
                  />
                </svg>
              </div>
            </div>
          )*/}
        </div>
      )}
    </div>
  );
};

export default Cards;
