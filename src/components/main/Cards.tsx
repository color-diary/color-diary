'use client';

import { DiaryList } from '@/types/diary.type';
import { formatFullDate } from '@/utils/dateUtils';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Calendar } from '../ui/calendar';
import PlusDiaryIcon from './assets/PlusDiaryIcon';

interface CardsProps {
  isCalendar: boolean;
  date: Date | undefined;
  setDate: Dispatch<SetStateAction<Date>>;
  handleInputDate: (e: ChangeEvent<HTMLInputElement>) => void;
  diaryList: DiaryList;
  isNeedNew: boolean;
  todayYYMM: number;
}

const Cards = ({ diaryList, isCalendar, date, setDate, handleInputDate, isNeedNew, todayYYMM }: CardsProps) => {
  const searchParams = useSearchParams();
  const route = useRouter();
  const today = new Date();

  diaryList.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    } else {
      return 1;
    }
  });

  const cardContent = () => {
    if (Number(searchParams.get('YYMM')) > todayYYMM) {
      return (
        <div className="flex flex-col items-center">
          <Image src="/FutureDiary.png" alt="FutureDiary" width={80} height={48} />
          <p className="mt-16px-col">미래의 감정은 나중에 기록 할 수 있어요.</p>
          <p>오늘의 감정을 작성해볼까요?</p>
        </div>
      );
    } else {
      if (diaryList.length === 0) {
        return (
          <div className="flex flex-col items-center">
            <Image src="/NoDiary.png" alt="NoDiary" width={52} height={48} />
            <p className="mt-16px-col">기록된 나의 감정이 없어요.</p>
            <p>캘린더로 돌아가 기록을 만들어볼까요?</p>
          </div>
        );
      } else {
        return (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {diaryList.map((diary) => {
              return (
                <div
                  key={diary.diaryId}
                  onClick={() => {
                    route.push(`/diaries/${diary.diaryId}?form=cards&YYMM=${searchParams.get('YYMM')}`);
                  }}
                  style={{ backgroundColor: `${diary.color}` }}
                  className="min-w-160px-row-m min-h-88px-col-m md:min-w-0 md:min-h-0 w-160px-row-m md:w-168px-row h-88px-col md:h-102px-col rounded-lg md:rounded-3xl overflow-hidden border md:border-2 border-[#E6D3BC]"
                >
                  <div className="flex justify-between px-16px-row-m md:px-24px-row py-4px-col-m md:py-8px-col bg-white">
                    <div className="text-12px-m md:text-16px">{new Date(diary.date).getDate()}일</div>
                    <p className="text-12px-m md:text-16px">{diary.tags[0]}</p>
                  </div>
                </div>
              );
            })}
            {isNeedNew && (
              <div
                onClick={() => {
                  route.push(
                    `/diaries/write/${formatFullDate(String(today))}?form=cards&YYMM=${searchParams.get('YYMM')}`
                  );
                }}
                className="min-w-160px-row-m min-h-88px-col-m md:min-w-0 md:min-h-0 w-160px-row-m md:w-168px-row h-88px-col md:h-102px-col rounded-lg md:rounded-3xl overflow-hidden border md:border-2 border-[#E6D3BC] bg-white shadow-[0_0_10px_0_#F1A027]"
              >
                <div className="flex px-16px-row-m md:px-24px-row py-4px-col-m md:py-8px-col text-12px-m md:text-16px">
                  {today.getDate()}일
                </div>
                <div className="flex justify-center items-center">
                  <PlusDiaryIcon />
                </div>
              </div>
            )}
          </div>
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Calendar
        isCalendar={isCalendar}
        diaryList={diaryList}
        month={date}
        onMonthChange={setDate}
        handleInputDate={handleInputDate}
      />
      {cardContent()}
    </div>
  );
};

export default Cards;
