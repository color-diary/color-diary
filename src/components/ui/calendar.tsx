'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import Stamp from '../main/Stamp';
import { useRouter } from 'next/navigation';
import { formatFullDate } from '@/utils/dateUtils';
import { Diary, DiaryList } from '@/types/diary.type';
import { createClient } from '@/utils/supabase/client';
import '../main/dateInput.css';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  diaryList: DiaryList;
  isCards: boolean;
  handleInputChangeDate?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  diaryList,
  isCards,
  handleInputChangeDate,
  ...props
}: CalendarProps) {
  const route = useRouter();
  const today = new Date();
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn('h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: `${isCards ? 'hidden' : 'flex'}`,
        head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        CaptionLabel: ({ ...props }) => {
          const dateInputRef = React.useRef<HTMLInputElement>(null);
          const handleInputDateChange = () => {
            if (dateInputRef.current) {
              dateInputRef.current.showPicker();
            }
          };

          return (
            <div className="anchor">
              <input type="date" ref={dateInputRef} style={{ visibility: 'hidden' }} onChange={handleInputChangeDate} />
              <p onClick={() => handleInputDateChange()}>
                {props.displayMonth.getFullYear()}년 {props.displayMonth.getMonth() + 1}월
              </p>
            </div>
          );
        },
        DayContent: ({ ...props }) => {
          let isToday = false;
          if (formatFullDate(String(today)) === formatFullDate(String(props.date))) {
            isToday = true;
          }

          const handleGoWirtePage = async () => {
            try {
              const supabase = createClient();
              const {
                data: { session },
                error
              } = await supabase.auth.getSession();

              if (error) {
                throw new Error(error.message);
              }
              if (!session) {
                if (2 <= diaryList.length) {
                  alert('비회원은 2개이상 작성할 수 없습니다.');
                } else {
                  route.push(`/diaries/write/${formatFullDate(String(props.date))}`);
                }
              } else {
                if (today < props.date) {
                  alert('미래의 일기는 작성하실 수 없습니다.');
                } else {
                  route.push(`/diaries/write/${formatFullDate(String(props.date))}`);
                }
              }
            } catch (error) {
              console.error('Failed to get session:', error);
            }
          };

          const handleFindDiary = (diary: Diary) => {
            if (formatFullDate(String(diary.date)) === formatFullDate(String(props.date))) {
              return true;
            } else {
              return false;
            }
          };
          const [diary, setDiary] = React.useState<Diary | undefined>();

          React.useEffect(() => {
            if (isCards) {
              return;
            } else {
              setDiary(diaryList?.find(handleFindDiary));
            }
          }, []);

          return isCards ? (
            <></>
          ) : diary ? (
            <div
              onClick={() => {
                route.push(`/diaries/${diary.diaryId}`);
              }}
              className="flex flex-col items-center"
            >
              <Stamp petal={diary.color} circle="#F7CA87" month={props.date.getMonth() + 1} />
              <p className="text-sm">{props.date.getDate()}</p>
            </div>
          ) : (
            <div
              onClick={() => {
                handleGoWirtePage();
              }}
              className="flex flex-col items-center "
            >
              <Stamp petal="#FFF" circle="#D4D4D4" month={props.date.getMonth() + 1} isToday={isToday} />
              <p className="text-sm">{props.date.getDate()}</p>
            </div>
          );
        }
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
