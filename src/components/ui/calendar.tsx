'use client';

import useAuth from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useToast } from '@/providers/toast.context';
import { Diary, DiaryList } from '@/types/diary.type';
import { formatFullDate } from '@/utils/dateUtils';
import { ko } from 'date-fns/locale';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import CalenderNextIcon from '../main/assets/CalenderNextIcon';
import CalenderPrevIcon from '../main/assets/CalenderPrevIcon';
import LoadingFall from '../main/assets/LoadingFall';
import LoadingSpring from '../main/assets/LoadingSpring';
import LoadingSummer from '../main/assets/LoadingSummer';
import LoadingWinter from '../main/assets/LoadingWinter';
import '../main/dateInput.css';
import Stamp from '../main/Stamp';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  diaryList: DiaryList;
  isCalendar: boolean;
  isLoading?: boolean;
  handleInputDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  month,
  onMonthChange,
  diaryList,
  handleInputDate,
  isCalendar,
  isLoading,
  ...props
}: CalendarProps) {
  const route = useRouter();
  const searchParams = useSearchParams();
  const ref = React.useRef<HTMLDivElement>(null);
  const [coverHeight, setCoverHeight] = React.useState(0);

  const updateTbodyHight = () => {
    if (ref.current) {
      const tbody = ref.current.getElementsByTagName('tbody')[0];
      if (tbody) {
        setCoverHeight(tbody.offsetHeight);
      }
    }
  };

  React.useEffect(() => {
    updateTbodyHight();
    //window.addEventListener();
  }, []);
  // 마운트 시 등록 언마운트 시 해제
  console.log(coverHeight);

  const toast = useToast();
  const { user } = useAuth();

  const today = new Date();

  return (
    <div className="relative" ref={ref}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        locale={ko}
        className={cn(className)}
        classNames={{
          months: `${
            isCalendar
              ? 'flex flex-col border-2 md:border-4 border-[--border-color] rounded-[24px] md:rounded-[32px] bg-[#fff]'
              : ''
          }`,
          month: '',
          caption: 'relative flex justify-center items-center',
          caption_label: 'text-sm font-medium',
          nav: 'flex items-center',
          nav_button: cn('h-7 w-7 bg-transparent opacity-50 hover:opacity-100'),

          table: `${
            isCalendar
              ? 'w-full border-collapse flex flex-col items-center md:px-72px-row md:py-24px-col px-16px-row-m py-16px-col-m '
              : 'hidden'
          }`,
          head: 'w-full gap-4 border-b border-[#25B18C]',
          head_row: `grid grid-cols-7 place-items-center py-8px-col-m md:py-16px-col px-16px-row-m md:px-16px-row`,
          head_cell: 'w-8 text-14px-m md:text-18px',
          tbody:
            'mt-2 md:mt-0 grid grid-rows-5 md:w-full gap-4 text-12px md:text-14px md:py-16px-col md:px-16px-row px-16px-row-m',
          row: 'grid grid-cols-7 place-items-center gap-2',
          cell: 'md:w-8',
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
          IconLeft: ({ ...props }) => <CalenderPrevIcon />,
          IconRight: ({ ...props }) => <CalenderNextIcon />,
          CaptionLabel: ({ ...props }) => {
            const dateInputRef = useRef<HTMLInputElement>(null);
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
          Caption: ({ ...props }) => {
            const goPrevMonth = () => {
              if (!month || !onMonthChange) return;
              onMonthChange(new Date(month.setMonth(month.getMonth() - 1)));
            };
            const goNextMonth = () => {
              if (!month || !onMonthChange) return;
              onMonthChange(new Date(month.setMonth(month.getMonth() + 1)));
            };
            const dateInputRef = React.useRef<HTMLInputElement>(null);
            const handleRef = () => {
              if (dateInputRef.current) {
                dateInputRef.current.showPicker();
              }
            };
            return (
              <div className="anchor cursor-pointer py-12px-col-m md:py-24px-col">
                <input type="date" ref={dateInputRef} style={{ visibility: 'hidden' }} onChange={handleInputDate} />
                <div className="flex items-center justify-center">
                  <div onClick={() => goPrevMonth()}>
                    <CalenderPrevIcon />
                  </div>
                  {month && (
                    <p onClick={() => handleRef()} className="text-16px-m md:text-24px">
                      {month.getFullYear()}년 {month.getMonth() + 1}월
                    </p>
                  )}
                  <div onClick={() => goNextMonth()}>
                    <CalenderNextIcon />
                  </div>
                </div>
              </div>
            );
          },
          DayContent: ({ ...props }) => {
            let isToday = false;
            if (formatFullDate(String(today)) === formatFullDate(String(props.date))) {
              isToday = true;
            }

            const handleGoWritePage = (): void => {
              if (!user) {
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
            };

            const handleFindDiary = (diary: Diary): boolean => {
              if (formatFullDate(String(diary.date)) === formatFullDate(String(props.date))) {
                return true;
              } else {
                return false;
              }
            };
            const [diaries, setDiaries] = useState<Diary>();

            useEffect(() => {
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
      <div
        className={`absolute bottom-24px-col border left-1 right-1 bg-[#fff] rounded-[24px] md:rounded-[32px] flex flex-col justify-center items-center`}
        style={{ height: `${coverHeight}px` }}
      >
        <div className="loading flex space-x-16px-row-m md:space-x-16px-row">
          <div className="w-32px-row-m md:w-40px-row delay-200 animate-[jump_1s_ease-in-out_infinite]">
            <LoadingSpring />
          </div>
          <div className="w-32px-row-m md:w-40px-row delay-500 animate-[jump_1s_ease-in-out_infinite]">
            <LoadingSummer />
          </div>
          <div className="w-32px-row-m md:w-40px-row delay-700 animate-[jump_1s_ease-in-out_infinite]">
            <LoadingFall />
          </div>
          <div className="w-32px-row-m md:w-40px-row delay-1000 animate-[jump_1s_ease-in-out_infinite]">
            <LoadingWinter />
          </div>
        </div>
        <p className="text-14px-m md:text-20px mt-24px-col-m md:mt-24px-col">
          계절을 불러오고 있어요. 잠시만 기다려주세요.
        </p>
      </div>
      {/* {isCalendar && isLoading && (
      )} */}
    </div>
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
