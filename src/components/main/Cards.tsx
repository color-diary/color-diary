'use client';

import { DiaryList } from '@/types/diary.type';
import { formatFullDate } from '@/utils/dateUtils';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar } from '../ui/calendar';

interface CardsProps {
  isCalendar: boolean;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  handleInputDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      return <p>미래의 일기는 아직 작성되어있지 않습니다.</p>;
    } else {
      if (diaryList.length === 0) {
        return (
          <div>
            <p>일기가 아직 작성되지 않았습니다.</p>
            <p>캘린더로 이동해 일기를 작성해주세요</p>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M11.9999 3C11.9999 2.84087 11.9367 2.68826 11.8242 2.57574C11.7116 2.46322 11.559 2.4 11.3999 2.4C11.2408 2.4 11.0882 2.46322 10.9756 2.57574C10.8631 2.68826 10.7999 2.84087 10.7999 3V10.8H2.9999C2.84077 10.8 2.68816 10.8632 2.57564 10.9757C2.46312 11.0883 2.3999 11.2409 2.3999 11.4C2.3999 11.5591 2.46312 11.7117 2.57564 11.8243C2.68816 11.9368 2.84077 12 2.9999 12H10.7999V19.8C10.7999 19.9591 10.8631 20.1117 10.9756 20.2243C11.0882 20.3368 11.2408 20.4 11.3999 20.4C11.559 20.4 11.7116 20.3368 11.8242 20.2243C11.9367 20.1117 11.9999 19.9591 11.9999 19.8V12H19.7999C19.959 12 20.1116 11.9368 20.2242 11.8243C20.3367 11.7117 20.3999 11.5591 20.3999 11.4C20.3999 11.2409 20.3367 11.0883 20.2242 10.9757C20.1116 10.8632 19.959 10.8 19.7999 10.8H11.9999V3Z"
                      fill="#080808"
                    />
                  </svg>
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
