'use client';

import React from 'react';
import { Calendar } from '../ui/calendar';
import { DiaryList } from '@/types/diary.type';
import './dateInput.css';

interface MainCalendarProps {
  diaryList: DiaryList;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  handleInputChangeDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MainCalendar = ({ diaryList, date, setDate, handleInputChangeDate }: MainCalendarProps) => {
  return (
    <div className="calendar">
      <input type="date" name="date" onChange={(e) => handleInputChangeDate(e)} />
      <Calendar
        mode="single"
        className="rounded-md border"
        diaryList={diaryList}
        month={date}
        onMonthChange={setDate}
        onPrevClick={() => {}}
        onNextClick={() => {}}
      />
    </div>
  );
};

export default MainCalendar;
