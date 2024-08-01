'use client';

import React from 'react';
import axios from 'axios';
import { DiaryList } from '@/types/diary.type';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import Cards from './Cards';

const MainSection = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [queryString, setQueryString] = React.useState<string>();
  const [diaryList, setDiaryList] = React.useState<DiaryList>([]);
  const getQueryStringDate = (type: string) => {
    if (typeof window !== 'undefined') {
      const YYMM = localStorage.getItem('queryString')?.slice(-6);
      if (YYMM) {
        return type === 'year' ? YYMM.slice(0, 4) : YYMM.slice(4, 6);
      }
    }
  };
  const today = new Date();
  const newDate = new Date(Number(getQueryStringDate('year')), Number(getQueryStringDate('month')) - 1, 1);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [form, setForm] = React.useState(params.get('form') ? params.get('form') : 'calendar');

  const getDiaryList = async (year: number, month: number) => {
    const supabase = createClient();
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();
    if (error) {
      alert(`로그인 정보를 확인하는데 실패했습니다: ${error.message}`);
    }

    if (session) {
      const response = await axios.get('/api/diaries', {
        params: { year, month }
      });
      const data = response.data;
      if (data) {
        setDiaryList(data);
      }
    } else {
      setDiaryList(JSON.parse(localStorage.getItem('localDiaries') || '[]'));
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

  const changeForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.target as HTMLButtonElement;
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

  React.useEffect(() => {
    const savedQueryString = localStorage.getItem('queryString');
    if (savedQueryString) {
      setQueryString(savedQueryString);
    }
    setDate(savedQueryString ? newDate : today);
  }, []);

  React.useEffect(() => {
    makeQueryString();
  }, [form, date]);

  React.useEffect(() => {
    if (queryString) {
      router.push(`${queryString}`);
      localStorage.setItem('queryString', queryString);
    }
  }, [queryString]);

  React.useEffect(() => {
    if (!date) return;
    setDate(date);
    getDiaryList(date.getFullYear(), date.getMonth() + 1);
  }, [date]);

  return (
    <div className="ml-96">
      <div className=" flex justify-between">
        <p>나의 감정 일기</p>
        <div className="flex justify-end">
          <button name="calendar" onClick={changeForm}>
            캘린더
          </button>
          <div className="bg-black h-4 w-0.5 mt-1 mx-2"></div>
          <button name="cards" onClick={changeForm}>
            카드
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
          />
        )}
      </div>
      <Button
        size={'lg'}
        className="flex justify-end"
        onClick={() => {
          router.push('/emotion-test');
        }}
      >
        나의 감정 확인하기
      </Button>
    </div>
  );

  // 버튼 기본 text color 흐리게 하고
  // let current = document.getElementById(currentClick);
  // // current.style.color = 'black';
};

export default MainSection;
