'use client';

import React from 'react';
import { CalendarSetProps } from '@/types/calendarSet.type';
import CalendarSet from './CalendarSet';

const CalendarLibrary = ({ diaryList, date, setDate, isCards, handleInputChangeDate }: CalendarSetProps) => {
  return (
    <CalendarSet
      isCards={isCards}
      diaryList={diaryList}
      date={date}
      setDate={setDate}
      handleInputChangeDate={handleInputChangeDate}
    />
  );
};

export default CalendarLibrary;
