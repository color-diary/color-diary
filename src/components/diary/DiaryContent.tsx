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
      <p className=" font-semibold text-24px"> {formattedDate}</p>
      <div className="flex flex-wrap gap-2">
        {diary.tags.map((tag, index) => (
          <span key={index} className="text-[#545454] mb-5 text-16px">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-start mb-3 w-[100%] h-[28%]">
        {diary.img ? (
          <div className="relative flex justify-start  w-[60%] h-[100%]">
            <Image src={diary.img} alt="Diary Image" layout="fill" objectFit="contain" priority={true} />
          </div>
        ) : (
          <div className="flex border w-[70%] h-[100%]" style={{ borderColor: diary.color }}>
            <div className="m-0  w-[80%]  " style={{ backgroundColor: diary.color }}></div>
            <div className="text-[#BABABA] w-[20%]  transform rotate-90 flex items-center justify-center m-0 text-20px">
              {diary.color}
            </div>
          </div>
        )}
      </div>
      <div className="mb-4 w-[90%] h-[60%]">
        <p className="text-20px">{diary.content}</p>
      </div>
      <div className="mb-4"></div>
    </>
  );
};

export default DiaryContent;
