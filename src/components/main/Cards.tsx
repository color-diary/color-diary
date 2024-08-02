'use client';

import { useRouter } from 'next/navigation';
import { Calendar } from '../ui/calendar';
import { DiaryList } from '@/types/diary.type';

interface CardsProps {
  isCalendar: boolean;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  handleInputDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  diaryList: DiaryList;
}

const Cards = ({ diaryList, isCalendar, date, setDate, handleInputDate }: CardsProps) => {
  const route = useRouter();
  const orderedList = diaryList.sort((a, b) => {
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
          diaryList={orderedList}
          month={date}
          onMonthChange={setDate}
          handleInputDate={handleInputDate}
        />
      </div>
      {diaryList.length === 0 ? (
        <p>일기가 아직 작성되지 않았습니다.</p>
      ) : (
        <div className="flex grid grid-cols-4 gap-x-24px-row gap-y-24px-col">
          {orderedList.map((diary) => {
            return (
              <div
                key={diary.diaryId}
                onClick={() => {
                  route.push(`/diaries/${diary.diaryId}`);
                }}
                className="border-2 border-solid border-[#E6D3BC] rounded-3xl overflow-hidden"
                style={{ backgroundColor: `${diary.color}` }}
              >
                <div className="flex justify-between text-sm px-24px-row py-8px-col bg-white">
                  <div className="text-16px">{new Date(diary.date).getDate()}</div>
                  <div className="text-ellipsis whitespace-nowrap overflow-hidden text-14px">{diary.tags[0]}</div>
                </div>
                <div className="h-64px-col "></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cards;
