'use client';

import { DiaryList } from '@/types/diary.type';
import { useRouter } from 'next/navigation';

interface CardsProps {
  diaryList: DiaryList;
}

const Cards = ({ diaryList }: CardsProps) => {
  const route = useRouter();
  //순서정렬 필요
  return (
    <div className="grid grid-cols-4 gap-6 h-[37.8rem]">
      {diaryList.map((diary) => {
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
            <div className="h-full " style={{ backgroundColor: `${diary.color}` }}></div>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
