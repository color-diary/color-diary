'use client';

import React from 'react';
import { Diary } from '@/types/diary.type';

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
          <span key={index}>#{tag}</span>
        ))}
      </div>
      <div>
        {diary.img ? (
          <div className="mb-4">
            <img src={diary.img} alt="Diary Image" className="w-[480px] h-[280px] rounded-lg" />
          </div>
        ) : (
          <div className="mb-4 w-[40px] h-[40px] rounded-full" style={{ backgroundColor: diary.color }}></div>
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
