'use client';

import useAuth from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useToast } from '@/providers/toast.context';
import { Diary, DiaryList } from '@/types/diary.type';
import { formatFullDate } from '@/utils/dateUtils';
import { ko } from 'date-fns/locale';
import { useRouter, useSearchParams } from 'next/navigation';
import { ComponentProps, useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import CalenderNextIcon from '../main/assets/CalenderNextIcon';
import CalenderPrevIcon from '../main/assets/CalenderPrevIcon';
import LoadingFall from '../main/assets/LoadingFall';
import LoadingSpring from '../main/assets/LoadingSpring';
import LoadingSummer from '../main/assets/LoadingSummer';
import LoadingWinter from '../main/assets/LoadingWinter';
import '../main/dateInput.css';
import Stamp from '../main/Stamp';
import PrevYearIcon from '../main/assets/PrevYearIcon';
import NextYearIcon from '../main/assets/NextYearIcon';
import CloseIcon from '../main/assets/closeIcon';

export type CalendarProps = ComponentProps<typeof DayPicker> & {
  diaryList: DiaryList;
  isCalendar: boolean;
  isLoading?: boolean;
  handleInputDate: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, calendarYear: number) => void;
  month: Date;
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
  const toast = useToast();
  const today = new Date();
  const route = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const tbodyRef = useRef<HTMLDivElement>(null);
  const [coverHeight, setCoverHeight] = useState<number>(330);

  const updateTbodyHight = () => {
    if (tbodyRef.current) {
      const tbody = tbodyRef.current.getElementsByTagName('tbody')[0];
      if (tbody) {
        setCoverHeight(tbody.offsetHeight);
      }
    }
  };

  if (isLoading) setTimeout(updateTbodyHight, 1);

  return (
    <div className="relative" ref={tbodyRef}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        locale={ko}
        month={month}
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
          Caption: ({ ...props }) => {
            const [calendarYear, setCalendarYear] = useState<number>(month.getFullYear());
            const [isOpenChangeDate, setIsOpenChangeDate] = useState<boolean>(false);
            const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            const goPrevMonth = () => {
              if (!month || !onMonthChange) return;
              onMonthChange(new Date(month.setMonth(month.getMonth() - 1)));
            };
            const goNextMonth = () => {
              if (!month || !onMonthChange) return;
              onMonthChange(new Date(month.setMonth(month.getMonth() + 1)));
            };
            return (
              <div className="anchor py-12px-col-m md:py-24px-col cursor-pointer">
                <div className="flex items-center justify-center">
                  <div onClick={() => goPrevMonth()}>
                    <CalenderPrevIcon />
                  </div>
                  {month && (
                    <>
                      <p
                        onClick={() => setIsOpenChangeDate((prev) => !prev)}
                        className="relative text-16px-m md:text-24px"
                      >
                        {month.getFullYear()}년 {month.getMonth() + 1}월
                      </p>
                      {isOpenChangeDate && (
                        <div className="absolute top-[4rem] bg-[#fff] border-4 border-[#E6D3BC] px-32px-row-m md:px-32px-row rounded-[32px] text-14px-m md:text-18px">
                          <button
                            onClick={() => setIsOpenChangeDate(false)}
                            className="absolute top-4 right-4 md:right-6 opacity-70"
                          >
                            <CloseIcon />
                          </button>
                          <div className="flex justify-center items-center py-16px-col">
                            <div
                              onClick={() => {
                                setCalendarYear((prev) => prev - 1);
                              }}
                            >
                              <PrevYearIcon />
                            </div>
                            {calendarYear}년
                            <div
                              onClick={() => {
                                setCalendarYear((prev) => prev + 1);
                              }}
                            >
                              <NextYearIcon />
                            </div>
                          </div>
                          <div className="grid grid-cols-6 py-24px-col gap-x-48px-row gap-y-32px-col">
                            {MONTHS.map((month) => {
                              return (
                                <button
                                  key={`${month}`}
                                  id={`${month}`}
                                  onClick={(e) => handleInputDate(e, calendarYear)}
                                  className="font-medium opacity-[.7] hover:opacity-100"
                                >
                                  {month}월
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
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
                <Stamp petal={diaries.color} circle="#F7CA87" month={month.getMonth() + 1} />
                <p className="text-12px-m md:text-14px mt-1">{props.date.getDate()}</p>
              </div>
            ) : (
              <div
                onClick={() => {
                  handleGoWritePage();
                }}
                className="flex flex-col items-center cursor-pointer"
              >
                <Stamp petal="#FFF" circle="#D4D4D4" month={month.getMonth() + 1} isToday={isToday} />
                <p className="text-12px-m md:text-14px mt-1">{props.date.getDate()}</p>
              </div>
            );
          }
        }}
        {...props}
      />
      {isCalendar && isLoading && (
        <div
          className={`absolute bottom-24px-col left-1 right-1 bg-[#fff] rounded-[24px] md:rounded-[32px] flex flex-col justify-center items-center`}
          style={{ height: `${coverHeight}px` }}
        >
          <div className="loading flex space-x-16px-row-m md:space-x-16px-row">
            <div className="w-32px-row-m md:w-40px-row animate-bounce">
              <LoadingSpring />
            </div>
            <div className="w-32px-row-m md:w-40px-row animate-[bounce_1s_infinite_250ms]">
              <LoadingSummer />
            </div>
            <div className="w-32px-row-m md:w-40px-row animate-[bounce_1s_infinite_500ms]">
              <LoadingFall />
            </div>
            <div className="w-32px-row-m md:w-40px-row animate-[bounce_1s_infinite_750ms]">
              <LoadingWinter />
            </div>
          </div>
          <p className="text-14px-m md:text-20px mt-24px-col-m md:mt-24px-col">
            계절을 불러오고 있어요. 잠시만 기다려주세요.
          </p>
        </div>
      )}
    </div>
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
