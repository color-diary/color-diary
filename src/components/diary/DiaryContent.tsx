import React from 'react';
import { Diary } from '@/types/diary.type';
import Image from 'next/image';

const DiaryContent = ({ diary }: { diary: Diary }) => {
  const dateObj = new Date(diary.date);

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  const formattedDate = `${year}년 ${month}월 ${day}일`;

  return (
    <>
      <p className="text-xl font-semibold"> {formattedDate}</p>
      <div className="flex flex-wrap gap-2">
        {diary.tags.map((tag, index) => (
          <span key={index} className="text-[#545454] mb-5">
            {tag}
          </span>
        ))}
      </div>
      <div>
        {diary.img ? (
          <Image
            src={diary.img}
            alt="Diary Image"
            width={100}
            height={100}
            className="rounded-lg object-cover w-full h-full"
            priority={true}
          />
        ) : (
          <div className="flex items-center m-0">
            <div className="mb-4 w-[20vw] h-[21vh]" style={{ backgroundColor: diary.color }}></div>
            <div className="text-[#BABABA] transform rotate-90 flex justify-center">{diary.color}</div>
          </div>
        )}
      </div>
      <div className="mb-4">
        <p>{diary.content}</p>
      </div>
      <div className="mb-4"></div>
    </>
  );
};

export default DiaryContent;
