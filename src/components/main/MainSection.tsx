'use client';

import React from 'react';
import MainCalendar from '@/components/main/MainCalendar';
import Cards from '@/components/main/Cards';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { DiaryList } from '@/types/diary.type';

const MainSection = () => {
  const router = useRouter();
  const now = new Date();
  const [diaryList, setDiaryList] = React.useState<DiaryList>([]);
  const [form, setForm] = React.useState<boolean>(true);
  const [year, setYear] = React.useState<number>(now.getFullYear());
  const [month, setMonth] = React.useState<number>(now.getMonth() + 1);
  const [date, setDate] = React.useState<Date>(now);

  const handleChangeForm = () => {
    setForm((prev) => !prev);
  };

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    console.log(date);

    if (date) {
      setYear(date.getFullYear());
      setMonth(date.getMonth() + 1);
      setDate(date);
    }
  };

  const getDiaryList = async () => {
    const response = await axios.get('/api/diaries', {
      params: { year, month }
    });
    setDiaryList(response.data);
  };

  React.useEffect(() => {
    try {
      getDiaryList();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <div>
        <input type="date" name="date" onChange={(e) => handleChangeDate(e)} />
      </div>
      <button onClick={() => handleChangeForm()}>캘린더 | 카드</button>
      {form ? <MainCalendar diaryList={diaryList} date={date} setDate={setDate} /> : <Cards diaryList={diaryList} />}
      <button
        onClick={() => {
          router.push('/emotion-test');
        }}
      >
        나의 감정 확인하기
      </button>
    </>
  );
};

export default MainSection;
