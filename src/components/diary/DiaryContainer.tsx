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
import TextButton from '../common/TextButton';
import Button from '../common/Button';
import { useToast } from '@/providers/toast.context';

const DiaryContainer = () => {
  const router = useRouter();
  const params = useParams();
  const diaryId = params.id as string;
  const toast = useToast();

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
          } else {
            toast.on({ label: '해당 다이어리를 찾을 수 없습니다.(비회원)' });
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

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/diaries/${diaryId}`);
    },
    onSuccess: () => {
      toast.on({ label: '다이어리삭제 성공' });

      router.push('/');
    },
    onError: (error: Error) => {
      console.error('Error deleting diary:', error);
      toast.on({ label: '다이어리삭제 에러' });
    }
  });

  if (isLoading || isQueryLoading) {
    return <p>Loading...</p>;
  }

  const diaryData = userId ? diary : localDiary;

  if (error) {
    return <p className="text-red-500">본인이 쓴 글이 아님</p>;
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
        toast.on({ label: '로컬다이어리 지우기 성공' });

        router.push('/');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div
        className="relative flex items-center justify-center w-[80vh] h-[88vh] rounded-[32px] border-4 border-[#E6D3BC] gap-[16px] p-[6.5vh] pl-[1.5vh]"
        style={{ backgroundColor: diaryData.color }}
      >
        <div className="flex flex-col gap-[20vh]">
          <div className="flex flex-col justify-center gap-[5vh]">
            <div className="w-[2vw] h-[2vw] bg-white rounded-full"></div>
            <div className="w-[2vw] h-[2vw] bg-white rounded-full"></div>
            <div className="w-[2vw] h-[2vw] bg-white rounded-full"></div>
          </div>
          <div className="flex flex-col justify-center gap-[5vh]">
            <div className="w-[2vw] h-[2vw] bg-white rounded-full"></div>
            <div className="w-[2vw] h-[2vw] bg-white rounded-full"></div>
            <div className="w-[2vw] h-[2vw] bg-white rounded-full"></div>
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center bg-white w-[50vw] h-[78vh] rounded-[32px] border border-[#E6D3BC] p-6">
          <div className="absolute top-6 left-10 flex items-center ">
            <TextButton onClick={handleBackward}>뒤로가기</TextButton>
          </div>

          <div className="absolute top-16 left-10 items-start justify-start p-1 ">
            <DiaryContent diary={diaryData} />
          </div>

          <div className="absolute bottom-5 right-5 flex gap-5">
            <Button
              onClick={handleEdit}
              icon={
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18.6159 1.51123C18.2877 1.16589 17.8937 0.889755 17.457 0.699088C17.0204 0.508422 16.55 0.407083 16.0736 0.401044C15.5972 0.395005 15.1244 0.484388 14.6831 0.663926C14.2418 0.843463 13.8408 1.10952 13.5039 1.44643L2.25394 12.6964C1.86127 13.0897 1.58865 13.5867 1.46794 14.1292L0.414342 18.8692C0.392305 18.9679 0.395535 19.0704 0.423733 19.1675C0.45193 19.2645 0.504181 19.3529 0.575638 19.4243C0.647095 19.4958 0.735443 19.548 0.832485 19.5762C0.929527 19.6044 1.03212 19.6077 1.13074 19.5856L5.84194 18.538C6.40329 18.4143 6.91728 18.1319 7.32274 17.7244L16.8987 8.14843L17.3031 8.55163C17.5281 8.77666 17.6545 9.08183 17.6545 9.40003C17.6545 9.71822 17.5281 10.0234 17.3031 10.2484L16.1751 11.3764C16.066 11.4897 16.0057 11.6414 16.0073 11.7987C16.0089 11.956 16.0722 12.1064 16.1836 12.2175C16.295 12.3286 16.4456 12.3915 16.6029 12.3927C16.7603 12.3938 16.9117 12.3331 17.0247 12.2236L18.1515 11.0956C18.6015 10.6456 18.8542 10.0352 18.8542 9.39883C18.8542 8.76243 18.6015 8.15209 18.1515 7.70203L17.7483 7.29883L18.5523 6.49483C19.2106 5.83632 19.5855 4.94671 19.5971 4.01572C19.6088 3.08472 19.2575 2.18601 18.6159 1.51123ZM14.3511 2.29483C14.7967 1.85563 15.3978 1.61041 16.0234 1.61266C16.649 1.6149 17.2484 1.86442 17.6908 2.3068C18.1332 2.74918 18.3827 3.34853 18.3849 3.97415C18.3872 4.59976 18.1419 5.20089 17.7027 5.64643L6.47434 16.876C6.23022 17.1222 5.9202 17.2926 5.58154 17.3668L1.78954 18.2092L2.63914 14.3896C2.71004 14.0694 2.8712 13.7763 3.10354 13.5448L14.3511 2.29483Z"
                    fill="white"
                  />
                </svg>
              }
            >
              수정하기
            </Button>
            <Button
              onClick={handleDelete}
              icon={
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="icon/delet">
                    <path
                      id="Vector"
                      d="M11.5 4C11.5 3.60218 11.342 3.22064 11.0607 2.93934C10.7794 2.65804 10.3978 2.5 10 2.5C9.60218 2.5 9.22064 2.65804 8.93934 2.93934C8.65804 3.22064 8.5 3.60218 8.5 4H11.5ZM7.5 4C7.5 3.33696 7.76339 2.70107 8.23223 2.23223C8.70107 1.76339 9.33696 1.5 10 1.5C10.663 1.5 11.2989 1.76339 11.7678 2.23223C12.2366 2.70107 12.5 3.33696 12.5 4H17.5C17.6326 4 17.7598 4.05268 17.8536 4.14645C17.9473 4.24021 18 4.36739 18 4.5C18 4.63261 17.9473 4.75979 17.8536 4.85355C17.7598 4.94732 17.6326 5 17.5 5H16.446L15.961 9.196C15.6384 9.10747 15.3083 9.04856 14.975 9.02L15.44 5H4.561L5.741 15.23C5.79743 15.7174 6.03105 16.167 6.39742 16.4934C6.76379 16.8198 7.23735 17.0001 7.728 17H9.6C9.784 17.3587 10.003 17.692 10.257 18H7.728C6.99195 17.9999 6.28161 17.7293 5.73214 17.2396C5.18266 16.7498 4.8324 16.0752 4.748 15.344L3.554 5H2.5C2.36739 5 2.24021 4.94732 2.14645 4.85355C2.05268 4.75979 2 4.63261 2 4.5C2 4.36739 2.05268 4.24021 2.14645 4.14645C2.24021 4.05268 2.36739 4 2.5 4H7.5ZM19 14.5C19 15.6935 18.5259 16.8381 17.682 17.682C16.8381 18.5259 15.6935 19 14.5 19C13.3065 19 12.1619 18.5259 11.318 17.682C10.4741 16.8381 10 15.6935 10 14.5C10 13.3065 10.4741 12.1619 11.318 11.318C12.1619 10.4741 13.3065 10 14.5 10C15.6935 10 16.8381 10.4741 17.682 11.318C18.5259 12.1619 19 13.3065 19 14.5ZM16.354 13.354C16.4479 13.2601 16.5006 13.1328 16.5006 13C16.5006 12.8672 16.4479 12.7399 16.354 12.646C16.2601 12.5521 16.1328 12.4994 16 12.4994C15.8672 12.4994 15.7399 12.5521 15.646 12.646L14.5 13.793L13.354 12.646C13.2601 12.5521 13.1328 12.4994 13 12.4994C12.8672 12.4994 12.7399 12.5521 12.646 12.646C12.5521 12.7399 12.4994 12.8672 12.4994 13C12.4994 13.1328 12.5521 13.2601 12.646 13.354L13.793 14.5L12.646 15.646C12.5995 15.6925 12.5626 15.7477 12.5375 15.8084C12.5123 15.8692 12.4994 15.9343 12.4994 16C12.4994 16.0657 12.5123 16.1308 12.5375 16.1916C12.5626 16.2523 12.5995 16.3075 12.646 16.354C12.6925 16.4005 12.7477 16.4374 12.8084 16.4625C12.8692 16.4877 12.9343 16.5006 13 16.5006C13.0657 16.5006 13.1308 16.4877 13.1916 16.4625C13.2523 16.4374 13.3075 16.4005 13.354 16.354L14.5 15.207L15.646 16.354C15.6925 16.4005 15.7477 16.4374 15.8084 16.4625C15.8692 16.4877 15.9343 16.5006 16 16.5006C16.0657 16.5006 16.1308 16.4877 16.1916 16.4625C16.2523 16.4374 16.3075 16.4005 16.354 16.354C16.4005 16.3075 16.4374 16.2523 16.4625 16.1916C16.4877 16.1308 16.5006 16.0657 16.5006 16C16.5006 15.9343 16.4877 15.8692 16.4625 15.8084C16.4374 15.7477 16.4005 15.6925 16.354 15.646L15.207 14.5L16.354 13.354Z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
              }
            >
              삭제하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryContainer;
