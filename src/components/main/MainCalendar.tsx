'use client';

import React from 'react';
import { Calendar } from '../ui/calendar';
import { DiaryList } from '@/types/diary.type';

interface MainCalendarProps {
  diaryList: DiaryList;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const MainCalendar = ({ diaryList, date, setDate }: MainCalendarProps) => {
  return (
    <div>
      <Calendar
        mode="single"
        className="rounded-md border w-[35rem] h-[35rem]"
        diaryList={diaryList}
        month={date}
        onMonthChange={setDate}
      />
    </div>
  );
};

export default MainCalendar;
