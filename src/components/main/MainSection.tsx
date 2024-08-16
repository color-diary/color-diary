'use client';

import useChannelTalk from '@/hooks/useChannelTalk';
import { Diary, DiaryList } from '@/types/diary.type';
import { formatFullDate } from '@/utils/dateUtils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';
import { Calendar } from '../ui/calendar';
import BackTodayIcon from './assets/BackTodayIcon';
import BluredCalendarIcon from './assets/BluredCalendarIcon';
import BluredCardsIcon from './assets/BluredCardsIcon';
import FocusedCalendarIcon from './assets/FocusedCalendarIcon';
import FocusedCardsIcon from './assets/FocusedCardsIcon';
import GoEmotionTestIcon from './assets/GoEmotionTestIcon';
import SeparatorIcon from './assets/SeparatorIcon';
import Cards from './Cards';

const MainSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useChannelTalk();

  const makeQueryString = (form: String, date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    if (form === 'YYMM') {
      if (String(date.getMonth() + 1).length === 1) {
        return Number(String(year) + String(0) + String(month));
      } else {
        return Number(String(year) + String(month));
      }
    } else {
      if (String(date.getMonth() + 1).length === 1) {
        setQueryString(`?form=${form}&YYMM=${String(year) + String(0) + String(month)}`);
      } else {
        setQueryString(`?form=${form}&YYMM=${String(year) + String(month)}`);
      }
    }
  };

  const newDate = new Date(
    Number(searchParams.get('YYMM')?.slice(0, 4)),
    Number(searchParams.get('YYMM')?.slice(4, 6)) - 1,
    1
  );
  const today = new Date();
  const todayYYMM = makeQueryString('YYMM', today) as number;

  const getInitialValue = (type: string) => {
    if (type === 'date') {
      return searchParams.get('YYMM') ? newDate : today;
    }
    if (type === 'form') {
      return searchParams.get('form') ? searchParams.get('form') : 'calendar';
    }
  };

  const [queryString, setQueryString] = useState<string>();
  const [date, setDate] = useState<Date>(getInitialValue('date') as Date);
  const [form, setForm] = useState<String>(getInitialValue('form') as string);
  const [isNeedNew, setIsNeedNew] = useState<boolean>(false);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();

  const diaries = useQuery<DiaryList>({
    queryKey: ['diaries', 'main', year, month],
    queryFn: async () => {
      if (isLoading) return [];
      if (user) {
        const { data } = await axios.get(`/api/diaries?year=${year}&month=${month}`);
        checkTodayWritten(data);
        return data;
      } else {
        const data = JSON.parse(localStorage.getItem('localDiaries') || '[]');
        const localList = data.filter((diary: Diary) => {
          const diaryYear = new Date(diary.date).getFullYear();
          const diaryMonth = new Date(diary.date).getMonth() + 1;
          return diaryMonth === month && diaryYear === year;
        });
        checkTodayWritten(localList);
        return localList;
      }
    }
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['diaries', 'main', year, month] });
  }, [user]);

  useEffect(() => {
    setDate(date);
  }, [date]);

  useEffect(() => {
    makeQueryString(form, date);
  }, [form, date]);

  useEffect(() => {
    if (queryString) {
      router.push(`${queryString}`);
    }
  }, [queryString]);

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

  return (
    <div className="flex flex-col min-w-[335px] w-335px-row-m md:w-744px-row mx-auto mt-12 md:mt-144px-col space-y-24px-col-m">
      <div className="flex justify-between">
        <p className="text-18px-m md:text-24px font-bold">나의 감정 기록</p>
        <div className="flex items-center">
          <button
            name="calendar"
            onClick={(e) => {
              changeForm(e.currentTarget.name);
            }}
          >
            <div className="flex items-center cursor-pointer">
              <p className="text-12px-m md:text-14px">캘린더</p>
              {form === 'calendar' ? <FocusedCalendarIcon /> : <BluredCalendarIcon />}
            </div>
          </button>
          <div>
            <SeparatorIcon />
          </div>
          <button
            name="cards"
            onClick={(e) => {
              changeForm(e.currentTarget.name);
            }}
          >
            <div className="flex items-center cursor-pointer">
              <p className="text-12px-m md:text-14px">감정카드</p>
              {form === 'cards' ? <FocusedCardsIcon /> : <BluredCardsIcon />}
            </div>
          </button>
        </div>
      </div>
      <div className="relative">
        {form === 'calendar' ? (
          <div>
            <Calendar
              isCalendar={form === 'calendar'}
              handleInputDate={handleInputDate}
              diaryList={diaries.data || []}
              month={date}
              onMonthChange={setDate}
              isLoading={diaries.isLoading}
            />
          </div>
        ) : (
          <Cards
            isCalendar={form === 'calendar'}
            handleInputDate={handleInputDate}
            diaryList={diaries.data || []}
            date={date}
            setDate={setDate}
            isNeedNew={isNeedNew}
            todayYYMM={todayYYMM}
          />
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          size="md"
          priority="secondary"
          icon={<BackTodayIcon />}
          onClick={() => {
            setDate(today);
          }}
        >
          오늘로 돌아가기
        </Button>
        <Button size="md" priority="primary" icon={<GoEmotionTestIcon />} href={'/emotion-test'}>
          나의 감정 확인하기
        </Button>
      </div>
    </div>
  );
};

export default MainSection;
