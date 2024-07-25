'use client';

import { DiaryList } from '@/types/diary.type';
import { useRouter } from 'next/navigation';

interface CardsProps {
  diaryList: DiaryList;
}

const Cards = ({ diaryList }: CardsProps) => {
  const route = useRouter();

  return (
    <>
      {diaryList.map((diary) => {
        return (
          <div
            key={diary.diaryId}
            onClick={() => {
              route.push(`/diaries/${diary.diaryId}`);
            }}
            className="border m-3 p-3 rounded-lg w-64 "
          >
            <div className="flex justify-between">
              <div>{new Date(diary.date).getDate()}</div>
              <div>{diary.tags[0]}</div>
            </div>
            <div className="h-8" style={{ backgroundColor: `${diary.color}` }}></div>
          </div>
        );
      })}
    </>
  );
};

export default Cards;
