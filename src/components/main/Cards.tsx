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
      <div>
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
        <div className="grid grid-cols-4 gap-6 h-[37.8rem]">
          {orderedList.map((diary) => {
            return (
              <div
                key={diary.diaryId}
                onClick={() => {
                  route.push(`/diaries/${diary.diaryId}`);
                }}
                className="border-2 border-solid border-[#E6D3BC] rounded-3xl h-[6.3rem] overflow-hidden"
              >
                <div className="flex justify-between mx-8 my-2 text-sm">
                  <div>{new Date(diary.date).getDate()}</div>
                  <div className="text-ellipsis whitespace-nowrap overflow-hidden">{diary.tags[0]}</div>
                </div>
                <div className="h-full" style={{ backgroundColor: `${diary.color}` }}></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cards;
