'use client';

import React from 'react';
import Cards from '@/components/main/Cards';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { DiaryList } from '@/types/diary.type';
import { createClient } from '@/utils/supabase/client';
import CalendarLibrary from './CalendarLibrary';
import { Button } from '../ui/button';

const MainSection = () => {
  const now = new Date();
  const router = useRouter();
  const params = useSearchParams();
  const isCards = params.get('form') === 'cards';
  const [form, setForm] = React.useState(isCards ? 'cards' : 'calendar');
  const [diaryList, setDiaryList] = React.useState<DiaryList | null>(null);
  const [queryString, setQueryString] = React.useState<String>();

  const handleYearMonthDefaultValue = (type: string) => {
    const YYMM = params.get('YYMM');
    if (YYMM) {
      if (type === 'year') {
        return YYMM.slice(0, 4);
      }
      if (type === 'month') {
        return YYMM.slice(4, 6);
      }
    }
  };

  const [year, setYear] = React.useState<number>(Number(handleYearMonthDefaultValue('year')));
  const [month, setMonth] = React.useState<number>(Number(handleYearMonthDefaultValue('month')));
  const [date, setDate] = React.useState<Date>(now);
  const handleClickButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.target as HTMLButtonElement;
    if (name === form) {
      return;
    }
    setForm(name);
  };
  // 버튼 기본 text color 흐리게 하고
  // let current = document.getElementById(currentClick);
  // current.style.color = 'black';

  const handleQueryString = () => {
    if (!year) {
      setYear(now.getFullYear());
      setMonth(now.getMonth() + 1);
    } else {
      if (String(month).length === 1) {
        setQueryString(`?form=${form}&YYMM=${String(year) + String(0) + String(month)}`);
      } else {
        setQueryString(`?form=${form}&YYMM=${String(year) + String(month)}`);
      }
    }
  };

  const handleInputChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);

    if (date) {
      setYear(date.getFullYear());
      setMonth(date.getMonth() + 1);
      setDate(date);
    }
  };

  const getDiaryList = async () => {
    if (year) {
      try {
        const supabase = createClient();
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error) {
          throw new Error(error.message);
        }
        session ? getUserDiaryList() : getUserLocalList();
      } catch (error) {
        console.error('Failed to get session:', error);
      }
    }
  };

  const getUserDiaryList = async () => {
    const response = await axios.get('/api/diaries', {
      params: { year, month }
    });
    const data = response.data;
    if (data) {
      setDiaryList(data);
    }
  };

  const getUserLocalList = async () => {
    setDiaryList(JSON.parse(localStorage.getItem('localDiaries') || '[]'));
  };

  React.useEffect(() => {
    getDiaryList();
  }, [year, month]);

  React.useEffect(() => {
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
    setDate(date);
  }, [date]);

  React.useEffect(() => {
    handleQueryString();
  }, [form, year, month]);

  React.useEffect(() => {
    if (queryString) {
      router.push(`${queryString}`);
    }
  }, [queryString]);

  React.useEffect(() => {
    const a = handleYearMonthDefaultValue('year');
    const b = handleYearMonthDefaultValue('month');

    setDate(new Date(Number(a), Number(b) - 1, 1));
  }, [params]);

  return (
    <div className="flex flex-col">
      <div className=" flex justify-between">
        <p>나의 감정 일기</p>
        <div className="flex">
          <button
            name="calendar"
            onClick={(e) => {
              handleClickButton(e);
            }}
          >
            캘린더
          </button>
          <div className="bg-black h-4 w-0.5 mt-1 mx-2"></div>
          <button
            name="cards"
            onClick={(e) => {
              handleClickButton(e);
            }}
          >
            카드
          </button>
        </div>
      </div>
      {isCards ? (
        <Cards
          diaryList={diaryList}
          isCards={isCards}
          date={date}
          setDate={setDate}
          handleInputChangeDate={handleInputChangeDate}
        />
      ) : (
        <CalendarLibrary
          diaryList={diaryList}
          date={date}
          setDate={setDate}
          isCards={isCards}
          handleInputChangeDate={handleInputChangeDate}
        />
      )}
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
};

export default MainSection;
