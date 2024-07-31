import React from 'react';
import { Calendar } from '../ui/calendar';
import { CalendarSetProps } from '@/types/calendarSet.type';

const CalendarSet = ({ diaryList, date, setDate, isCards, handleInputChangeDate }: CalendarSetProps) => {
  return (
    <div className={isCards ? 'h-[5rem] w-full flex justify-center' : 'calendar w-[46.5rem] h-[39.5rem] bg-gray-300'}>
      {diaryList && (
        <Calendar
          mode="single"
          className={
            isCards ? 'h-full' : 'rounded-[32px] border w-full h-full flex justify-center items-center px-[4.5rem]'
          }
          diaryList={diaryList}
          isCards={isCards}
          month={date}
          onMonthChange={setDate}
          handleInputChangeDate={handleInputChangeDate}
        />
      )}
    </div>
  );
};

export default CalendarSet;
