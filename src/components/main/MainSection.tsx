'use client';

import React from 'react';
import MainCalendar from '@/components/main/MainCalendar';
import Cards from '@/components/main/Cards';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { DiaryList } from '@/types/diary.type';
import { createClient } from '@/utils/supabase/client';

const MainSection = () => {
  const router = useRouter();
  const now = new Date();
  const params = useSearchParams();
  const isCards = params.get('form') === 'cards';
  const [form, setForm] = React.useState(isCards ? 'cards' : 'calendar');
  const [diaryList, setDiaryList] = React.useState<DiaryList>([]);
  const [year, setYear] = React.useState<number>(now.getFullYear());
  const [month, setMonth] = React.useState<number>(now.getMonth() + 1);
  const [queryString, setQueryString] = React.useState<String>();
  const [date, setDate] = React.useState<Date>(now);
  //
  // params get yymm ? 거기서 잘라서 넣기 : now.getFullYear()
  // month도 해라

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

  // for (const [key, value] of params) {
  //   console.log(`${key}: ${value}`);
  // }

  const handleQueryString = () => {
    if (String(month).length === 1) {
      setQueryString(`?form=${form}&YYMM=${String(year) + String(0) + String(month)}`);
    } else {
      setQueryString(`?form=${form}&YYMM=${String(year) + String(month)}`);
    }
  };

  const handleInputChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);

    if (date) {
      setYear(date.getFullYear());
      setMonth(date.getMonth() + 1);
      setDate(date);
    }
  };
  console.log(queryString);

  // 오늘 이후의 날짜면 클릭 못함
  //
  const getDiaryList = async () => {
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
  };

  const getUserDiaryList = async () => {
    const response = await axios.get('/api/diaries', {
      params: { year, month }
    });
    setDiaryList(response.data);
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
  console.log(year, month);

  React.useEffect(() => {
    if (queryString) {
      router.replace(`${queryString}`);
    }
  }, [queryString]);

  return (
    <div className="flex flex-col mx-auto mt-[8rem] w-[46.5rem]">
      <div className=" flex w-full justify-between">
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
      <div>
        {isCards ? (
          <Cards diaryList={diaryList} />
        ) : (
          <MainCalendar
            diaryList={diaryList}
            date={date}
            setDate={setDate}
            handleInputChangeDate={handleInputChangeDate}
          />
        )}
      </div>
      <button
        onClick={() => {
          router.push('/emotion-test');
        }}
        className="flex justify-end"
      >
        나의 감정 확인하기
      </button>
    </div>
  );
};

export default MainSection;
