'use client';

import { useToast } from '@/providers/toast.context';
import { Diary, DiaryList } from '@/types/diary.type';
import { formatFullDate, getQueryStringDate } from '@/utils/dateUtils';
import { createClient } from '@/utils/supabase/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../common/Button';
import { Calendar } from '../ui/calendar';
import Cards from './Cards';
import { useQuery } from '@tanstack/react-query';

const MainSection = () => {
  const router = useRouter();
  const toast = useToast();

  const today = new Date();
  const newDate = new Date(Number(getQueryStringDate('year')), Number(getQueryStringDate('month')) - 1, 1);

  const [queryString, setQueryString] = useState<string>();
  const [diaryList, setDiaryList] = useState<DiaryList>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [form, setForm] = useState<String | undefined>(undefined);
  const [isNeedNew, setIsNeedNew] = useState<boolean>(false);

  const getDiaryList = async (year: number, month: number) => {
    const supabase = createClient();
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();
    if (error) {
      toast.on({ label: `로그인 정보를 확인하는데 실패했습니다: ${error.message}` });
    }

    if (session) {
      const response = await axios.get('/api/diaries', {
        params: { year, month }
      });
      const data = response.data;
      if (data) {
        setDiaryList(data);
        checkTodayWritten(data);
      }
    } else {
      const data = JSON.parse(localStorage.getItem('localDiaries') || '[]');
      setDiaryList(data);
      checkTodayWritten(data);
    }
  };

  const checkTodayWritten = (data: DiaryList) => {
    setIsNeedNew(false);
    if (formatFullDate(String(data[0]?.date)).slice(0, 7) === formatFullDate(String(today)).slice(0, 7)) {
      const findDiary = data.find((i: Diary) => {
        return new Date(i.date).getDate() === today.getDate();
      });
      if (findDiary) {
        setIsNeedNew(false);
      } else {
        setIsNeedNew(true);
      }
    }
  };

  const makeQueryString = () => {
    if (!date) return;
    if (String(date.getMonth() + 1).length === 1) {
      setQueryString(`?form=${form}&YYMM=${String(date.getFullYear()) + String(0) + String(date.getMonth() + 1)}`);
    } else {
      setQueryString(`?form=${form}&YYMM=${String(date.getFullYear()) + String(date.getMonth() + 1)}`);
    }
  };

  const changeForm = (name: string) => {
    if (name === form) {
      return;
    }
    setForm(name);
  };

  const handleInputDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (date) {
      setDate(date);
    }
  };

  useEffect(() => {
    const savedQueryString = localStorage.getItem('queryString');
    if (savedQueryString) {
      setQueryString(savedQueryString);
      const start = savedQueryString.indexOf('=');
      const end = savedQueryString.indexOf('&');
      setForm(savedQueryString.slice(start + 1, end));
    } else {
      setForm('calendar');
    }
    setDate(savedQueryString ? newDate : today);
  }, []);

  useEffect(() => {
    if (!date) return;
    setDate(date);
    getDiaryList(date.getFullYear(), date.getMonth() + 1);
  }, [date]);

  useEffect(() => {
    makeQueryString();
  }, [form, date]);

  useEffect(() => {
    if (queryString) {
      router.push(`${queryString}`);
      localStorage.setItem('queryString', queryString);
    }
  }, [queryString]);

  return (
    <div className="h-screen flex justify-center mt-200px-col">
      <div className="px-20px-row-m">
        <div className=" flex justify-between mb-36px-col w-[350px] md:w-full">
          <p className="text-18px-m md:text-24px font-bold">나의 감정 기록</p>
          <div className="flex justify-end md:text-14px text-12px-m">
            <button
              name="calendar"
              onClick={(e) => {
                changeForm(e.currentTarget.name);
              }}
            >
              <div className="flex px-8px-row space-x-4px-row items-center">
                <p>캘린더</p>
                {form === 'calendar' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5.5 3C4.83696 3 4.20107 3.26339 3.73223 3.73223C3.26339 4.20107 3 4.83696 3 5.5V6H17V5.5C17 4.83696 16.7366 4.20107 16.2678 3.73223C15.7989 3.26339 15.163 3 14.5 3H5.5ZM17 7H3V14.5C3 15.163 3.26339 15.7989 3.73223 16.2678C4.20107 16.7366 4.83696 17 5.5 17H14.5C15.163 17 15.7989 16.7366 16.2678 16.2678C16.7366 15.7989 17 15.163 17 14.5V7ZM8 10C8 10.2652 7.89464 10.5196 7.70711 10.7071C7.51957 10.8946 7.26522 11 7 11C6.73478 11 6.48043 10.8946 6.29289 10.7071C6.10536 10.5196 6 10.2652 6 10C6 9.73478 6.10536 9.48043 6.29289 9.29289C6.48043 9.10536 6.73478 9 7 9C7.26522 9 7.51957 9.10536 7.70711 9.29289C7.89464 9.48043 8 9.73478 8 10ZM7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12C7.26522 12 7.51957 12.1054 7.70711 12.2929C7.89464 12.4804 8 12.7348 8 13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14ZM11 10C11 10.2652 10.8946 10.5196 10.7071 10.7071C10.5196 10.8946 10.2652 11 10 11C9.73478 11 9.48043 10.8946 9.29289 10.7071C9.10536 10.5196 9 10.2652 9 10C9 9.73478 9.10536 9.48043 9.29289 9.29289C9.48043 9.10536 9.73478 9 10 9C10.2652 9 10.5196 9.10536 10.7071 9.29289C10.8946 9.48043 11 9.73478 11 10ZM10 14C9.73478 14 9.48043 13.8946 9.29289 13.7071C9.10536 13.5196 9 13.2652 9 13C9 12.7348 9.10536 12.4804 9.29289 12.2929C9.48043 12.1054 9.73478 12 10 12C10.2652 12 10.5196 12.1054 10.7071 12.2929C10.8946 12.4804 11 12.7348 11 13C11 13.2652 10.8946 13.5196 10.7071 13.7071C10.5196 13.8946 10.2652 14 10 14ZM14 10C14 10.2652 13.8946 10.5196 13.7071 10.7071C13.5196 10.8946 13.2652 11 13 11C12.7348 11 12.4804 10.8946 12.2929 10.7071C12.1054 10.5196 12 10.2652 12 10C12 9.73478 12.1054 9.48043 12.2929 9.29289C12.4804 9.10536 12.7348 9 13 9C13.2652 9 13.5196 9.10536 13.7071 9.29289C13.8946 9.48043 14 9.73478 14 10Z"
                      fill="#080808"
                    />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7 11C7.26522 11 7.51957 10.8946 7.70711 10.7071C7.89464 10.5196 8 10.2652 8 10C8 9.73478 7.89464 9.48043 7.70711 9.29289C7.51957 9.10536 7.26522 9 7 9C6.73478 9 6.48043 9.10536 6.29289 9.29289C6.10536 9.48043 6 9.73478 6 10C6 10.2652 6.10536 10.5196 6.29289 10.7071C6.48043 10.8946 6.73478 11 7 11ZM8 13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12C7.26522 12 7.51957 12.1054 7.70711 12.2929C7.89464 12.4804 8 12.7348 8 13ZM10 11C10.2652 11 10.5196 10.8946 10.7071 10.7071C10.8946 10.5196 11 10.2652 11 10C11 9.73478 10.8946 9.48043 10.7071 9.29289C10.5196 9.10536 10.2652 9 10 9C9.73478 9 9.48043 9.10536 9.29289 9.29289C9.10536 9.48043 9 9.73478 9 10C9 10.2652 9.10536 10.5196 9.29289 10.7071C9.48043 10.8946 9.73478 11 10 11ZM11 13C11 13.2652 10.8946 13.5196 10.7071 13.7071C10.5196 13.8946 10.2652 14 10 14C9.73478 14 9.48043 13.8946 9.29289 13.7071C9.10536 13.5196 9 13.2652 9 13C9 12.7348 9.10536 12.4804 9.29289 12.2929C9.48043 12.1054 9.73478 12 10 12C10.2652 12 10.5196 12.1054 10.7071 12.2929C10.8946 12.4804 11 12.7348 11 13ZM13 11C13.2652 11 13.5196 10.8946 13.7071 10.7071C13.8946 10.5196 14 10.2652 14 10C14 9.73478 13.8946 9.48043 13.7071 9.29289C13.5196 9.10536 13.2652 9 13 9C12.7348 9 12.4804 9.10536 12.2929 9.29289C12.1054 9.48043 12 9.73478 12 10C12 10.2652 12.1054 10.5196 12.2929 10.7071C12.4804 10.8946 12.7348 11 13 11ZM17 5.5C17 4.83696 16.7366 4.20107 16.2678 3.73223C15.7989 3.26339 15.163 3 14.5 3H5.5C4.83696 3 4.20107 3.26339 3.73223 3.73223C3.26339 4.20107 3 4.83696 3 5.5V14.5C3 15.163 3.26339 15.7989 3.73223 16.2678C4.20107 16.7366 4.83696 17 5.5 17H14.5C15.163 17 15.7989 16.7366 16.2678 16.2678C16.7366 15.7989 17 15.163 17 14.5V5.5ZM4 7H16V14.5C16 14.8978 15.842 15.2794 15.5607 15.5607C15.2794 15.842 14.8978 16 14.5 16H5.5C5.10218 16 4.72064 15.842 4.43934 15.5607C4.15804 15.2794 4 14.8978 4 14.5V7ZM5.5 4H14.5C14.8978 4 15.2794 4.15804 15.5607 4.43934C15.842 4.72064 16 5.10218 16 5.5V6H4V5.5C4 5.10218 4.15804 4.72064 4.43934 4.43934C4.72064 4.15804 5.10218 4 5.5 4Z"
                      fill="#080808"
                    />
                  </svg>
                )}
              </div>
            </button>
            <div className="bg-black h-4 w-0.5 mt-1 mx-2"></div>
            <button
              name="cards"
              onClick={(e) => {
                changeForm(e.currentTarget.name);
              }}
            >
              <div className="flex px-8px-row space-x-4px-row items-center justify-center">
                <p>카드</p>
                {form === 'cards' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M7.5 11C7.89782 11 8.27936 11.158 8.56066 11.4393C8.84196 11.7206 9 12.1022 9 12.5V16.5C9 16.8978 8.84196 17.2794 8.56066 17.5607C8.27936 17.842 7.89782 18 7.5 18H3.5C3.10218 18 2.72064 17.842 2.43934 17.5607C2.15804 17.2794 2 16.8978 2 16.5V12.5C2 12.1022 2.15804 11.7206 2.43934 11.4393C2.72064 11.158 3.10218 11 3.5 11H7.5ZM16.5 11C16.8978 11 17.2794 11.158 17.5607 11.4393C17.842 11.7206 18 12.1022 18 12.5V16.5C18 16.8978 17.842 17.2794 17.5607 17.5607C17.2794 17.842 16.8978 18 16.5 18H12.5C12.1022 18 11.7206 17.842 11.4393 17.5607C11.158 17.2794 11 16.8978 11 16.5V12.5C11 12.1022 11.158 11.7206 11.4393 11.4393C11.7206 11.158 12.1022 11 12.5 11H16.5ZM7.5 2C7.89782 2 8.27936 2.15804 8.56066 2.43934C8.84196 2.72064 9 3.10218 9 3.5V7.5C9 7.89782 8.84196 8.27936 8.56066 8.56066C8.27936 8.84196 7.89782 9 7.5 9H3.5C3.10218 9 2.72064 8.84196 2.43934 8.56066C2.15804 8.27936 2 7.89782 2 7.5V3.5C2 3.10218 2.15804 2.72064 2.43934 2.43934C2.72064 2.15804 3.10218 2 3.5 2H7.5ZM16.5 2C16.8978 2 17.2794 2.15804 17.5607 2.43934C17.842 2.72064 18 3.10218 18 3.5V7.5C18 7.89782 17.842 8.27936 17.5607 8.56066C17.2794 8.84196 16.8978 9 16.5 9H12.5C12.1022 9 11.7206 8.84196 11.4393 8.56066C11.158 8.27936 11 7.89782 11 7.5V3.5C11 3.10218 11.158 2.72064 11.4393 2.43934C11.7206 2.15804 12.1022 2 12.5 2H16.5Z"
                      fill="#080808"
                    />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="#080808">
                    <path
                      d="M7.5 11C7.89782 11 8.27936 11.158 8.56066 11.4393C8.84196 11.7206 9 12.1022 9 12.5V16.5C9 16.8978 8.84196 17.2794 8.56066 17.5607C8.27936 17.842 7.89782 18 7.5 18H3.5C3.10218 18 2.72064 17.842 2.43934 17.5607C2.15804 17.2794 2 16.8978 2 16.5V12.5C2 12.1022 2.15804 11.7206 2.43934 11.4393C2.72064 11.158 3.10218 11 3.5 11H7.5ZM16.5 11C16.8978 11 17.2794 11.158 17.5607 11.4393C17.842 11.7206 18 12.1022 18 12.5V16.5C18 16.8978 17.842 17.2794 17.5607 17.5607C17.2794 17.842 16.8978 18 16.5 18H12.5C12.1022 18 11.7206 17.842 11.4393 17.5607C11.158 17.2794 11 16.8978 11 16.5V12.5C11 12.1022 11.158 11.7206 11.4393 11.4393C11.7206 11.158 12.1022 11 12.5 11H16.5ZM7.5 12H3.5C3.36739 12 3.24021 12.0527 3.14645 12.1464C3.05268 12.2402 3 12.3674 3 12.5V16.5C3 16.6326 3.05268 16.7598 3.14645 16.8536C3.24021 16.9473 3.36739 17 3.5 17H7.5C7.63261 17 7.75979 16.9473 7.85355 16.8536C7.94732 16.7598 8 16.6326 8 16.5V12.5C8 12.3674 7.94732 12.2402 7.85355 12.1464C7.75979 12.0527 7.63261 12 7.5 12ZM16.5 12H12.5C12.3674 12 12.2402 12.0527 12.1464 12.1464C12.0527 12.2402 12 12.3674 12 12.5V16.5C12 16.6326 12.0527 16.7598 12.1464 16.8536C12.2402 16.9473 12.3674 17 12.5 17H16.5C16.6326 17 16.7598 16.9473 16.8536 16.8536C16.9473 16.7598 17 16.6326 17 16.5V12.5C17 12.3674 16.9473 12.2402 16.8536 12.1464C16.7598 12.0527 16.6326 12 16.5 12ZM7.5 2C7.89782 2 8.27936 2.15804 8.56066 2.43934C8.84196 2.72064 9 3.10218 9 3.5V7.5C9 7.89782 8.84196 8.27936 8.56066 8.56066C8.27936 8.84196 7.89782 9 7.5 9H3.5C3.10218 9 2.72064 8.84196 2.43934 8.56066C2.15804 8.27936 2 7.89782 2 7.5V3.5C2 3.10218 2.15804 2.72064 2.43934 2.43934C2.72064 2.15804 3.10218 2 3.5 2H7.5ZM16.5 2C16.8978 2 17.2794 2.15804 17.5607 2.43934C17.842 2.72064 18 3.10218 18 3.5V7.5C18 7.89782 17.842 8.27936 17.5607 8.56066C17.2794 8.84196 16.8978 9 16.5 9H12.5C12.1022 9 11.7206 8.84196 11.4393 8.56066C11.158 8.27936 11 7.89782 11 7.5V3.5C11 3.10218 11.158 2.72064 11.4393 2.43934C11.7206 2.15804 12.1022 2 12.5 2H16.5ZM7.5 3H3.5C3.36739 3 3.24021 3.05268 3.14645 3.14645C3.05268 3.24021 3 3.36739 3 3.5V7.5C3 7.63261 3.05268 7.75979 3.14645 7.85355C3.24021 7.94732 3.36739 8 3.5 8H7.5C7.63261 8 7.75979 7.94732 7.85355 7.85355C7.94732 7.75979 8 7.63261 8 7.5V3.5C8 3.36739 7.94732 3.24021 7.85355 3.14645C7.75979 3.05268 7.63261 3 7.5 3ZM16.5 3H12.5C12.3674 3 12.2402 3.05268 12.1464 3.14645C12.0527 3.24021 12 3.36739 12 3.5V7.5C12 7.63261 12.0527 7.75979 12.1464 7.85355C12.2402 7.94732 12.3674 8 12.5 8H16.5C16.6326 8 16.7598 7.94732 16.8536 7.85355C16.9473 7.75979 17 7.63261 17 7.5V3.5C17 3.36739 16.9473 3.24021 16.8536 3.14645C16.7598 3.05268 16.6326 3 16.5 3Z"
                      fill="#080808"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          {form === 'calendar' ? (
            <div>
              <Calendar
                isCalendar={form === 'calendar'}
                handleInputDate={handleInputDate}
                diaryList={diaryList}
                month={date}
                onMonthChange={setDate}
              />
            </div>
          ) : (
            <Cards
              isCalendar={form === 'calendar'}
              handleInputDate={handleInputDate}
              diaryList={diaryList}
              date={date}
              setDate={setDate}
              isNeedNew={isNeedNew}
            />
          )}
        </div>
        <div className="mt-24px-col w-full flex justify-end">
          <Button
            size="mdFix"
            priority="primary"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.64589 4.14699C7.73953 4.05312 7.8666 4.00028 7.99919 4.00009C8.13177 3.9999 8.259 4.05238 8.35289 4.14599L13.8369 9.61099C13.8881 9.66208 13.9288 9.72278 13.9566 9.78962C13.9843 9.85646 13.9986 9.92812 13.9986 10.0005C13.9986 10.0729 13.9843 10.1445 13.9566 10.2113C13.9288 10.2782 13.8881 10.3389 13.8369 10.39L8.35289 15.855C8.25847 15.9459 8.13209 15.9962 8.00099 15.9948C7.86989 15.9935 7.74455 15.9408 7.65197 15.8479C7.5594 15.7551 7.50699 15.6296 7.50604 15.4985C7.50509 15.3674 7.55567 15.2412 7.64689 15.147L12.8119 9.99999L7.64689 4.85399C7.55303 4.76035 7.50019 4.63327 7.5 4.50069C7.49981 4.36811 7.55229 4.24088 7.64589 4.14699Z"
                  fill="white"
                />
              </svg>
            }
            href={'/emotion-test'}
          >
            나의 감정 확인하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
