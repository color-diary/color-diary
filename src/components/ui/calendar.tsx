'use client';

import { cn } from '@/lib/utils';
import { useToast } from '@/providers/toast.context';
import { Diary, DiaryList } from '@/types/diary.type';
import { formatFullDate } from '@/utils/dateUtils';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import '../main/dateInput.css';
import Stamp from '../main/Stamp';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  diaryList: DiaryList;
  isCalendar: boolean;
  handleInputDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  diaryList,
  isCalendar,
  handleInputDate,
  ...props
}: CalendarProps) {
  const route = useRouter();
  const today = new Date();
  const toast = useToast();
  const searchParams = useSearchParams();
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(className)}
      classNames={{
        months: `${
          isCalendar
            ? 'flex flex-col border-2 md:border-4 border-[--border-color] rounded-[24px] md:rounded-[32px]'
            : ''
        }`,
        month: '',
        caption: 'relative flex justify-center',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center',
        nav_button: cn('h-7 w-7 bg-transparent opacity-50 hover:opacity-100'),
        nav_button_previous: `${
          isCalendar ? 'absolute left-70px-row-m md:left-230px-row' : 'absolute md:right-230px-row'
        }`,
        nav_button_next: `${
          isCalendar ? 'absolute right-60px-row-m md:right-200px-row' : 'absolute md:left-250px-row'
        }`,
        table: `${
          isCalendar
            ? 'w-full border-collapse flex flex-col items-center md:px-72px-row md:py-24px-col px-16px-row-m py-16px-col-m '
            : 'hidden'
        }`,
        head_row: `border-b border-[#25B18C] flex md:space-x-48px-row space-x-12px-row-m px-16px-row-m py-8px-col-m md:px-16px-row md:py-16px-col`,
        head_cell: 'w-9 font-normal text-14px-m md:text-18px md:w-8',
        tbody: 'mt-2 md:mt-0 flex flex-col',
        row: 'flex space-x-12px-row-m space-y-12px-col-m md:space-x-48px-row md:px-16px-row md:py-16px-col first:justify-end',
        cell: 'flex items-end',
        day: '',
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
        IconLeft: ({ ...props }) => (
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 10 20" fill="none">
            <path
              d="M9.6389 16.4629C9.80789 16.6319 9.90283 16.8611 9.90283 17.1001C9.90283 17.3391 9.80789 17.5683 9.6389 17.7373C9.4699 17.9063 9.24069 18.0012 9.0017 18.0012C8.7627 18.0012 8.53349 17.9063 8.3645 17.7373L0.264496 9.63728C0.180682 9.55368 0.114183 9.45436 0.0688124 9.34502C0.0234404 9.23568 8.58307e-05 9.11846 8.58307e-05 9.00008C8.58307e-05 8.8817 0.0234404 8.76448 0.0688124 8.65514C0.114183 8.5458 0.180682 8.44649 0.264496 8.36288L8.3645 0.262884C8.53349 0.0938873 8.7627 -0.00105286 9.0017 -0.00105286C9.24069 -0.00105286 9.4699 0.0938873 9.6389 0.262884C9.80789 0.431879 9.90283 0.661087 9.90283 0.900084C9.90283 1.13908 9.80789 1.36829 9.6389 1.53728L2.1743 9.00008L9.6389 16.4629Z"
              fill="#080808"
            />
          </svg>
        ),
        IconRight: ({ ...props }) => (
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="20" viewBox="0 0 10 18" fill="none">
            <path
              d="M0.762716 1.53721C0.59372 1.36821 0.498779 1.139 0.498779 0.900008C0.498779 0.661012 0.59372 0.431804 0.762716 0.262808C0.931711 0.093812 1.16092 -0.00112915 1.39992 -0.00112915C1.63891 -0.00112916 1.86812 0.093812 2.03712 0.262808L10.1371 8.36281C10.2209 8.44641 10.2874 8.54573 10.3328 8.65507C10.3782 8.76441 10.4015 8.88163 10.4015 9.00001C10.4015 9.11839 10.3782 9.23561 10.3328 9.34495C10.2874 9.45429 10.2209 9.55361 10.1371 9.63721L2.03712 17.7372C1.86812 17.9062 1.63891 18.0011 1.39992 18.0011C1.16092 18.0011 0.931711 17.9062 0.762716 17.7372C0.59372 17.5682 0.498779 17.339 0.498779 17.1C0.498779 16.861 0.59372 16.6318 0.762716 16.4628L8.22731 9.00001L0.762716 1.53721Z"
              fill="#080808"
            />
          </svg>
        ),
        CaptionLabel: ({ ...props }) => {
          const dateInputRef = React.useRef<HTMLInputElement>(null);
          const handleRef = () => {
            if (dateInputRef.current) {
              dateInputRef.current.showPicker();
            }
          };
          return (
            <div className="anchor cursor-pointer py-12px-col-m md:py-24px-col">
              <input type="date" ref={dateInputRef} style={{ visibility: 'hidden' }} onChange={handleInputDate} />
              <p onClick={() => handleRef()} className="text-16px-m md:text-24px">
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

          const handleGoWritePage = async () => {
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
                  toast.on({ label: '비회원은 2개이상 작성할 수 없습니다.' });
                } else if (today < props.date) {
                  toast.on({ label: '미래의 일기는 작성하실 수 없습니다.' });
                } else {
                  route.push(
                    `/diaries/write/${formatFullDate(String(props.date))}?form=calendar&YYMM=${searchParams.get(
                      'YYMM'
                    )}`
                  );
                }
              } else {
                if (today < props.date) {
                  toast.on({ label: '미래의 일기는 작성하실 수 없습니다.' });
                } else {
                  route.push(
                    `/diaries/write/${formatFullDate(String(props.date))}?form=calendar&YYMM=${searchParams.get(
                      'YYMM'
                    )}`
                  );
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
          const [diaries, setDiaries] = React.useState<Diary>();

          React.useEffect(() => {
            if (!isCalendar) {
              return;
            } else {
              setDiaries(diaryList.find(handleFindDiary));
            }
          }, []);

          return diaries ? (
            <div
              onClick={() => {
                route.push(`/diaries/${diaries.diaryId}?form=calendar&YYMM=${searchParams.get('YYMM')}`);
              }}
              className="flex flex-col items-center cursor-pointer"
            >
              <Stamp petal={diaries.color} circle="#F7CA87" month={props.date.getMonth() + 1} />
              <p className="text-12px-m md:text-14px">{props.date.getDate()}</p>
            </div>
          ) : (
            <div
              onClick={() => {
                handleGoWritePage();
              }}
              className="flex flex-col items-center cursor-pointer"
            >
              <Stamp petal="#FFF" circle="#D4D4D4" month={props.date.getMonth() + 1} isToday={isToday} />
              <p className="text-12px-m md:text-14px mt-1">{props.date.getDate()}</p>
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
