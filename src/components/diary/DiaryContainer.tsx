'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DiaryContent from './DiaryContent';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { createClient } from '@/utils/supabase/client';
import useZustandStore from '@/zustand/zustandStore';
import { Diary } from '@/types/diary.type';
import { fetchDiary } from '@/apis/diary';
import { deleteFromLocal } from '@/utils/diaryLocalStorage';

const DiaryContainer = () => {
  const router = useRouter();
  const params = useParams();
  const diaryId = params.id as string;

  const { setColor, setTags, setContent, setImg, setIsDiaryEditMode } = useZustandStore();
  const [localDiary, setLocalDiary] = useState<Diary | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error) {
          throw new Error(error.message);
        }

        if (session) {
          setUserId(session.user.id);
        } else {
          const savedDiaries = JSON.parse(localStorage.getItem('localDiaries') || '[]');
          const foundDiary = savedDiaries.find((diary: Diary) => diary.diaryId === diaryId);
          if (foundDiary) {
            setLocalDiary(foundDiary);
            setColor(foundDiary.color);
            setTags(foundDiary.tags);
            setContent(foundDiary.content);
            setImg(foundDiary.img ? foundDiary.img : null);
          } else {
            alert('해당 다이어리를 찾을 수 없습니다.');
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Failed to get session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [router, diaryId, setColor, setTags, setContent, setImg]);

  const {
    data: diary,
    error,
    isLoading: isQueryLoading
  } = useQuery({
    queryKey: ['diary', diaryId],
    queryFn: () => fetchDiary(diaryId),
    enabled: !!userId
  });

  useEffect(() => {
    if (diary) {
      setColor(diary.color);
      setTags(diary.tags);
      setContent(diary.content);
      setImg(diary.img ? diary.img : null);
    }
  }, [diary, setColor, setTags, setContent, setImg]);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/diaries/${diaryId}`);
    },
    onSuccess: () => {
      alert('Diary deleted successfully');
      router.push('/');
    },
    onError: (error: Error) => {
      console.error('Error deleting diary:', error);
      alert('Failed to delete diary. Please try again.');
    }
  });

  if (isLoading || isQueryLoading) {
    return <p>Loading...</p>;
  }

  const diaryData = userId ? diary : localDiary;

  if (error) {
    return <p className="text-red-500">Error fetching diary data</p>;
  }

  if (!diaryData) {
    return <p>No diary found</p>;
  }

  const handleBackward = () => {
    const confirmed = window.confirm('정말 뒤로 가시겠습니까?');
    if (confirmed) {
      router.back();
    }
  };

  const handleEdit = () => {
    setColor(diaryData.color);
    setTags(diaryData.tags);
    setContent(diaryData.content);
    setImg(diaryData.img ? diaryData.img : null);

    setIsDiaryEditMode(true);

    router.push(`/diaries/edit/${diaryId}`);
  };

  const handleDelete = () => {
    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (confirmed) {
      if (userId) {
        deleteMutation.mutate();
      } else {
        deleteFromLocal(diaryId);
        alert('Diary deleted successfully');
        router.push('/');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div
        className="relative flex flex-col items-center justify-center w-5/12 h-5/6 rounded-2xl gap-1 p-0"
        style={{ backgroundColor: diaryData.color }}
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
            <div className="w-8 하-8 bg-white rounded-full"></div>
            <div className="w-8 하-8 bg-white rounded-full"></div>
            <div className="w-8 하-8 bg-white rounded-full"></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center bg-slate-100 w-[520px] h-[550px] rounded-2xl">
          <DiaryContent diary={diaryData} />
          <div className="flex gap-5">
            <button className="bg-slate-300" onClick={handleEdit}>
              수정하기
            </button>
            <button className="bg-slate-400" onClick={handleDelete}>
              삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryContainer;
