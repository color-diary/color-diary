'use client';

import React from 'react';
import MainCalendar from '@/components/main/MainCalendar';
import Cards from '@/components/main/Cards';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { DiaryList } from '@/types/diary.type';

const MainSection = () => {
  const router = useRouter();
  const [form, setForm] = React.useState(true);
  const [diaryList, setDiaryList] = React.useState<DiaryList>([]);
  // write page params로 date 받아서 사용함  /diaries/write/date
  // read page params로 diary id 받아서 사용함  /diaries/id
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const startDate = new Date(Number(year), Number(month) - 1, 1);
  const endDate = new Date(Number(year), Number(month), 0);
  //
  const handleChangeForm = () => {
    setForm((prev) => !prev);
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
    console.log(startDate.getDate(), endDate.getDate());
    console.log('앞부분 남은거', startDate.getDay(), '뒷부분 남은거', 6 - endDate.getDay());
  }, []); // , [] 하기에는 diaryList의 변화를 감지할 수 없고 랜더링 될 때(의존성 배열x)에 실행하면 지나쳐
  console.log(diaryList); //log 3개 지우기

  return (
    <>
      <input type="date" />
      <button onClick={() => handleChangeForm()}>캘린더 | 카드</button>
      {form ? <MainCalendar diaryList={diaryList} /> : <Cards diaryList={diaryList} />}
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
