'use client';

import { useRouter, useParams } from 'next/navigation';

import { useState, useEffect } from 'react';
import ColorPicker from '@/components/diary/ColorPicker';
import ImgDrop from '@/components/diary/ImgDrop';
import { NewDiary } from '@/types/diary.type';

import { urlToFile } from '@/utils/imageFileUtils';
import { createClient } from '@/utils/supabase/client';
import useZustandStore from '@/zustand/zustandStore';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { checkDiaryExistsForDate, isLocalDiaryOverTwo, saveToLocal, updateLocalDiary } from '@/utils/diaryLocalStorage';

import { checkHasDiaryData } from '@/apis/diary';
import EmotionTagsInput from './EmotionTagsInput';
import DiaryTextArea from './DiaryTextArea';

const WriteForm = () => {
  const router = useRouter();
  const params = useParams();
  const date = params.id as string;
  const diaryId = params.id as string;

  const { color, tags, content, img, isDiaryEditMode, setIsDiaryEditMode } = useZustandStore((state) => ({
    color: state.color,
    tags: state.tags,
    content: state.content,
    img: state.img,
    isDiaryEditMode: state.isDiaryEditMode,
    setIsDiaryEditMode: state.setIsDiaryEditMode
  }));
  const [userId, setUserId] = useState<string | null>(null);

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
        }
      } catch (error) {
        console.error('Failed to get session:', error);
      }
    };

    fetchSession();
  }, [router]);

  useEffect(() => {
    const checkDiary = async () => {
      if (userId) {
        const hasTodayDiary = await checkHasDiaryData(date);
        if (!hasTodayDiary) {
          alert('오늘 이미 일기를 작성하셨네요!');
          router.replace('/');
        }
      } else {
        if (!isDiaryEditMode) {
          if (checkDiaryExistsForDate(date)) {
            alert('오늘 이미 일기를 작성하셨네요!');
            router.replace('/');
          } else if (isLocalDiaryOverTwo()) {
            alert('비회원은 최대 2개의 다이어리만 작성할 수 있습니다.');
            router.replace('/');
          }
        }
      }
    };
    checkDiary();
  }, [date, userId, router]);

  const mutation = useMutation({
    mutationFn: async (newDiary: NewDiary) => {
      const formData = new FormData();
      if (newDiary.userId) formData.append('userId', newDiary.userId);
      formData.append('color', newDiary.color);
      formData.append('tags', JSON.stringify(newDiary.tags));
      formData.append('content', newDiary.content);
      formData.append('date', newDiary.date);
      if (newDiary.img) {
        const file = typeof newDiary.img === 'string' ? await urlToFile(newDiary.img) : newDiary.img;
        formData.append('img', file);
      }

      formData.append('date', newDiary.date);

      if (isDiaryEditMode) {
        await axios.patch(`/api/diaries/${diaryId}`, formData);
      } else {
        await axios.post('/api/diaries', formData);
      }
    },
    onSuccess: () => {
      alert(isDiaryEditMode ? '수정 완료' : '작성 완료');
      setIsDiaryEditMode(false);
      router.replace('/');
    },
    onError: (error: Error) => {
      console.error('Error saving diary:', error);
      alert('작성 실패. 다시 시도해 주세요.');
    }
  });

  const handleWrite = () => {
    if (!userId) {
      saveToLocal(color, tags, content, img, date);
      router.replace('/');
      return;
    }
    if (!isDiaryEditMode) {
      mutation.mutate({
        userId,
        color,
        tags,
        content,
        img,
        date
      });
    }
    router.replace('/');
  };

  const handleEdit = () => {
    if (!userId) {
      updateLocalDiary(diaryId, color, tags, content, img, date);
      router.replace('/');
      alert('비회원 수정완료.');
      return;
    }

    mutation.mutate({
      userId,
      color,
      tags,
      content,
      img,
      date
    });
  };

  const handleBackward = () => {
    const confirmed = window.confirm('정말 뒤로 가시겠습니까? 변경 사항이 저장되지 않을 수 있습니다.');

    if (confirmed) {
      router.back();
      setIsDiaryEditMode(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center bg-slate-500 w-5/12 h-5/6 rounded-2xl">
        <div className="flex gap-80">
          <button className="flex items-center gap-2 p-7" onClick={handleBackward}>
            <div>svg</div>
            뒤로가기
          </button>

          <button className="flex bg-red-100 m-7" onClick={isDiaryEditMode ? handleEdit : handleWrite}>
            {isDiaryEditMode ? '수정하기' : '작성완료'}
            <div>svg</div>
          </button>
        </div>
        <div className="flex flex-col gap-7 items-center justify-center bg-slate-100 w-10/12 h-5/6 rounded-2xl mb-6">
          <form className="flex flex-col gap-7">
            <ColorPicker />
            <EmotionTagsInput />
            <DiaryTextArea />
            <div className="flex relative">
              <ImgDrop />
              <div className="absolute bottom-0 right-0 flex flex-col items-end p-4">
                <p>오늘 나의 감정이 궁금하다면?</p>
                <Link href="/emotion-test">
                  <button className="bg-slate-400 rounded-2xl p-2">나의 감정 확인하기</button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WriteForm;
