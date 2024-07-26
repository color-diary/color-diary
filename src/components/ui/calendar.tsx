'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Stamp from '../main/Stamp';
import { useRouter } from 'next/navigation';
import { formatFullDate } from '@/utils/dateUtils';
import { Diary, DiaryList } from '@/types/diary.type';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & { diaryList: DiaryList };

function Calendar({ className, classNames, showOutsideDays = false, diaryList, ...props }: CalendarProps) {
  const route = useRouter();
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
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
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
        DayContent: ({ ...props }) => {
          const handleFindDiary = (diary: Diary) => {
            if (formatFullDate(String(diary.date)) === formatFullDate(String(props.date))) {
              return true; // diary 안넣어도 자동적으로 return 해줌
            } else {
              return false;
            }
          };
          const [diary, setDiary] = React.useState<Diary | undefined>();

          // 비회원인 경우 추가하기
          // 반복되는 find가 너무 많음(useEffect > useState 교체하기)
          React.useEffect(() => {
            setDiary(diaryList.find(handleFindDiary));
          }, []);

          return diary ? (
            <div
              onClick={() => {
                route.push(`/diaries/${diary.diaryId}`);
              }}
            >
              <Stamp color={diary.color} month={props.date.getMonth()} />
            </div>
          ) : (
            <div
              onClick={() => {
                route.push(`/diaries/write/${formatFullDate(String(props.date))}`);
              }}
            >
              <Stamp color={'#c1d2deac'} month={props.date.getMonth() + 1} />
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
