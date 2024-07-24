'use client';
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import DiaryContent from './DiaryContent';
import { useQuery } from '@tanstack/react-query';
import { fetchDiary } from '@/apis/diary';

const DiaryContainer = () => {
  const router = useRouter();
  const params = useParams();
  const diaryId = params.id as string;

  const {
    data: diary,
    error,
    isLoading
  } = useQuery({
    queryKey: ['diary', diaryId],
    queryFn: () => fetchDiary(diaryId)
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error fetching diary data</p>;
  }

  if (!diary) {
    return <p>No diary found</p>;
  }

  const handleBackward = () => {
    const confirmed = window.confirm('정말 뒤로 가시겠습니까?');
    if (confirmed) {
      router.back();
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div
          className="relative flex flex-col items-center justify-center  w-5/12 h-5/6 rounded-2xl gap-1 p-0"
          style={{ backgroundColor: diary.color }}
        >
          <button
            className="absolute top-6 left-20 flex items-center gap-2 p-2 bg-orange-100 h-6 m-0"
            onClick={handleBackward}
          >
            <div>svg</div> 뒤로가기
          </button>
          <div className="absolute top-24 left-7 flex flex-col gap-40 w-auto">
            <div className="flex flex-col justify-center gap-9">
              <div className="w-8 h-8 bg-white rounded-full"></div>
              <div className="w-8 h-8 bg-white rounded-full"></div>
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
            <div className="flex flex-col justify-center gap-9">
              <div className="w-8 h-8 bg-white rounded-full"></div>
              <div className="w-8 h-8 bg-white rounded-full"></div>
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-slate-100 w-[520px] h-[550px] rounded-2xl">
            <DiaryContent diary={diary} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DiaryContainer;