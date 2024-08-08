'use client';

import { DiaryList } from '@/types/diary.type';
import { formatFullDate } from '@/utils/dateUtils';
import { useRouter } from 'next/navigation';
import { Calendar } from '../ui/calendar';

interface CardsProps {
  isCalendar: boolean;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  handleInputDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  diaryList: DiaryList;
  isNeedNew: boolean;
}

const Cards = ({ diaryList, isCalendar, date, setDate, handleInputDate, isNeedNew }: CardsProps) => {
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
    <div className="">
      <div className="">
        <Calendar
          isCalendar={isCalendar}
          diaryList={diaryList}
          month={date}
          onMonthChange={setDate}
          handleInputDate={handleInputDate}
        />
      </div>
      <div className="">
        {diaryList.length === 0 ? (
          <p>일기가 아직 작성되지 않았습니다.</p>
        ) : (
          diaryList.map((diary) => {
            return (
              <div
                key={diary.diaryId}
                onClick={() => {
                  route.push(`/diaries/${diary.diaryId}`);
                }}
                className=""
                style={{ backgroundColor: `${diary.color}` }}
              >
                <div className="">
                  <div className="">{new Date(diary.date).getDate()}일</div>
                  <div className="">{diary.tags[0]}</div>
                </div>
                <div className=""></div>
              </div>
            );
          })
        )}
        {isNeedNew && (
          <div
            onClick={() => {
              route.push(`/diaries/write/${formatFullDate(String(today))}`);
            }}
            className=""
          >
            <div className="">
              <div className="">{today.getDate()}</div>
            </div>
            <div className="">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11.9999 3C11.9999 2.84087 11.9367 2.68826 11.8242 2.57574C11.7116 2.46322 11.559 2.4 11.3999 2.4C11.2408 2.4 11.0882 2.46322 10.9756 2.57574C10.8631 2.68826 10.7999 2.84087 10.7999 3V10.8H2.9999C2.84077 10.8 2.68816 10.8632 2.57564 10.9757C2.46312 11.0883 2.3999 11.2409 2.3999 11.4C2.3999 11.5591 2.46312 11.7117 2.57564 11.8243C2.68816 11.9368 2.84077 12 2.9999 12H10.7999V19.8C10.7999 19.9591 10.8631 20.1117 10.9756 20.2243C11.0882 20.3368 11.2408 20.4 11.3999 20.4C11.559 20.4 11.7116 20.3368 11.8242 20.2243C11.9367 20.1117 11.9999 19.9591 11.9999 19.8V12H19.7999C19.959 12 20.1116 11.9368 20.2242 11.8243C20.3367 11.7117 20.3999 11.5591 20.3999 11.4C20.3999 11.2409 20.3367 11.0883 20.2242 10.9757C20.1116 10.8632 19.959 10.8 19.7999 10.8H11.9999V3Z"
                  fill="#080808"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cards;
