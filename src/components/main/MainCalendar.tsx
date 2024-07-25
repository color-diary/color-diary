'use client';

import React from 'react';
import { Calendar } from '../ui/calendar';
import { Diary, DiaryList } from '@/types/diary.type';

interface MainCalendarProps {
  diaryList: DiaryList;
}

const MainCalendar = ({ diaryList }: MainCalendarProps) => {
  return (
    <div>
      <Calendar mode="single" className="rounded-md border w-[35rem] h-[35rem]" diaryList={diaryList} />
    </div>
  );
};

export default MainCalendar;
