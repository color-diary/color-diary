'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import ColorPicker from '@/components/diary/ColorPicker';
import EmotionTags from '@/components/diary/EmotionTags';
import DiaryContent from '@/components/diary/DiaryContent';
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

const WritePage = () => {
  const router = useRouter();
  const { id: date } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { color, tags, content, img } = useZustandStore((state) => ({
    color: state.color,
    tags: state.tags,
    content: state.content,
    img: state.img
  }));
  const [userId, setUserId] = useState<string | null>(null);

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

  const mutation = useMutation({
    mutationFn: async (newDiary: NewDiary) => {
      const formData = new FormData();
      if (newDiary.userId) formData.append('userId', newDiary.userId);
      formData.append('color', newDiary.color);
      formData.append('tags', JSON.stringify(newDiary.tags));
      formData.append('content', newDiary.content);
      if (newDiary.img) formData.append('img', newDiary.img);
      formData.append('date', newDiary.date);

      await axios.post('/api/diaries', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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
            <EmotionTags />
            <DiaryContent />
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

export default WritePage;

//  < 뒤로가기svg
//   <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path
//   d="M7.0926 10.9752C7.20526 11.0879 7.26855 11.2407 7.26855 11.4C7.26855 11.5594 7.20526 11.7122 7.0926 11.8248C6.97993 11.9375 6.82713 12.0008 6.6678 12.0008C6.50847 12.0008 6.35566 11.9375 6.243 11.8248L0.842997 6.42483C0.787121 6.3691 0.742789 6.30289 0.712542 6.22999C0.682294 6.1571 0.666724 6.07896 0.666724 6.00003C0.666724 5.92111 0.682294 5.84297 0.712542 5.77007C0.742789 5.69718 0.787121 5.63097 0.842997 5.57523L6.243 0.175234C6.35566 0.0625701 6.50847 -0.000723413 6.6678 -0.00072341C6.82713 -0.000723407 6.97993 0.0625701 7.0926 0.175234C7.20526 0.287898 7.26855 0.440703 7.26855 0.600034C7.26855 0.759365 7.20526 0.91217 7.0926 1.02483L2.1162 6.00003L7.0926 10.9752Z"
//   fill="black"
// />
// </svg>

// 연필svg(작성완료)
// <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path
//   d="M18.6159 1.51123C18.2877 1.16589 17.8937 0.889755 17.457 0.699088C17.0204 0.508422 16.55 0.407083 16.0736 0.401044C15.5972 0.395005 15.1244 0.484388 14.6831 0.663926C14.2418 0.843463 13.8408 1.10952 13.5039 1.44643L2.25394 12.6964C1.86127 13.0897 1.58865 13.5867 1.46794 14.1292L0.414342 18.8692C0.392305 18.9679 0.395535 19.0704 0.423733 19.1675C0.45193 19.2645 0.504181 19.3529 0.575638 19.4243C0.647095 19.4958 0.735443 19.548 0.832485 19.5762C0.929527 19.6044 1.03212 19.6077 1.13074 19.5856L5.84194 18.538C6.40329 18.4143 6.91728 18.1319 7.32274 17.7244L16.8987 8.14843L17.3031 8.55163C17.5281 8.77666 17.6545 9.08183 17.6545 9.40003C17.6545 9.71822 17.5281 10.0234 17.3031 10.2484L16.1751 11.3764C16.066 11.4897 16.0057 11.6414 16.0073 11.7987C16.0089 11.956 16.0722 12.1064 16.1836 12.2175C16.295 12.3286 16.4456 12.3915 16.6029 12.3927C16.7603 12.3938 16.9117 12.3331 17.0247 12.2236L18.1515 11.0956C18.6015 10.6456 18.8542 10.0352 18.8542 9.39883C18.8542 8.76243 18.6015 8.15209 18.1515 7.70203L17.7483 7.29883L18.5523 6.49483C19.2106 5.83632 19.5855 4.94671 19.5971 4.01572C19.6088 3.08472 19.2575 2.18601 18.6159 1.51123ZM14.3511 2.29483C14.7967 1.85563 15.3978 1.61041 16.0234 1.61266C16.649 1.6149 17.2484 1.86442 17.6908 2.3068C18.1332 2.74918 18.3827 3.34853 18.3849 3.97415C18.3872 4.59976 18.1419 5.20089 17.7027 5.64643L6.47434 16.876C6.23022 17.1222 5.9202 17.2926 5.58154 17.3668L1.78954 18.2092L2.63914 14.3896C2.71004 14.0694 2.8712 13.7763 3.10354 13.5448L14.3511 2.29483Z"
//   fill="black"
// />
// </svg>
