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
      <div className="flex items-start mb-3">
        {diary.img ? (
          <div className="relative h-[21vh] w-[21vh] flex-shrink-0">
            <Image
              src={diary.img}
              alt="Diary Image"
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
              priority={true}
            />
          </div>
        ) : (
          <div className="flex border w-[23vw] h-[21vh]" style={{ borderColor: diary.color }}>
            <div className="m-0 w-[18vw] h-[21vh]" style={{ backgroundColor: diary.color }}></div>
            <div className="text-[#BABABA] transform rotate-90 flex items-center justify-center m-0 text-20px">
              {diary.color}
            </div>
          </div>
        )}
      </div>
      <div className="mb-4">
        <p className="text-20px">{diary.content}</p>
      </div>
      <div className="mb-4"></div>
    </>
  );
};

export default DiaryContent;
