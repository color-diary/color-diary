'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
// import { createClient } from '@/utils/supabase/client';
// import { useState } from 'react';
// import { useEffect } from 'react';
import ColorPicker from '@/components/diary/ColorPicker';
import EmotionTagsInput from './EmotionTagsInput';
import DiaryTextArea from './DiaryTextArea';
import ImgDrop from '@/components/diary/ImgDrop';
import useZustandStore from '@/zustand/zustandStore';
import Link from 'next/link';

type NewDiary = {
  userId: string | null;
  color: string;
  tags: string[];
  content: string;
  img: File | null;
  date: string;
};

const WriteForm = () => {
  const router = useRouter();
  const params = useParams();
  const date = params.id as string;

  const { color, tags, content, img } = useZustandStore((state) => ({
    color: state.color,
    tags: state.tags,
    content: state.content,
    img: state.img
  }));
  // const [userId, setUserId] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchSession = async () => {
  //     try {
  //       const supabase = createClient();
  //       const {
  //         data: { session },
  //         error
  //       } = await supabase.auth.getSession();

  //       if (error) {
  //         throw new Error(error.message);
  //       }

  //       if (!session) {
  //         router.replace('/login');
  //         return;
  //       }

  //       setUserId(session.user.id);
  //     } catch (error) {
  //       console.error('Failed to get session:', error);
  //     }
  //   };

  //   fetchSession();
  // }, [router]);

  //유저아이디 테스트용 나중에 지울거임
  const userId = '6ab45165-5743-478e-af02-5e32fd66c7d0';

  const mutation = useMutation({
    mutationFn: async (newDiary: NewDiary) => {
      const formData = new FormData();
      if (newDiary.userId) formData.append('userId', newDiary.userId);
      formData.append('color', newDiary.color);
      formData.append('tags', JSON.stringify(newDiary.tags));
      formData.append('content', newDiary.content);
      if (newDiary.img) formData.append('img', newDiary.img);
      formData.append('date', newDiary.date);

      await axios.post('/api/diaries', formData);
    },
    onSuccess: () => {
      alert('작성완료');
      router.replace('/');
    },
    onError: (error: Error) => {
      console.error('Error creating diary:', error);
      alert('작성 실패. 다시 시도해 주세요.');
    }
  });

  const handleWrite = () => {
    // if (!userId) {
    //   alert('로그인이 필요합니다.');
    //   return;
    // }

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
      router.replace('/');
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

          <button className="flex bg-red-100 m-7" onClick={handleWrite}>
            작성완료
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
