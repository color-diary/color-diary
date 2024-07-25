'use client';

import React from 'react';
import { Calendar } from '../ui/calendar';
import { Diary, DiaryList } from '@/types/diary.type';

interface MainCalendarProps {
  diaryList: DiaryList;
}

const MainCalendar = ({ diaryList }: MainCalendarProps) => {
  diaryList.map((diary: Diary) => {
    return console.log(new Date(diary.date).getDate());
  });

  return (
    <div>
      <Calendar mode="single" className="rounded-md border w-[35rem] h-[35rem]" />
    </div>
  );
};

export default MainCalendar;
