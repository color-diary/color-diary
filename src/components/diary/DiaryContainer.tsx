'use client';

import { fetchDiary } from '@/apis/diary';
import { useModal } from '@/providers/modal.context';
import { useToast } from '@/providers/toast.context';
import { Diary } from '@/types/diary.type';
import { deleteFromLocal } from '@/utils/diaryLocalStorage';
import { createClient } from '@/utils/supabase/client';
import useZustandStore from '@/zustand/zustandStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../common/Button';
import TextButton from '../common/TextButton';
import DiaryContent from './DiaryContent';
import { useSearchParams } from 'next/navigation';

const DiaryContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const diaryId = params.id as string;

  const form = searchParams.get('form');
  const YYMM = searchParams.get('YYMM');

  const toast = useToast();
  const modal = useModal();

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
      toast.on({ label: '다이어리가 삭제되었습니다' });

      router.replace(`/?form=${form}&YYMM=${YYMM}`);
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
    router.back();
  };

  const handleEdit = () => {
    setColor(diaryData.color);
    setTags(diaryData.tags);
    setContent(diaryData.content);
    setImg(diaryData.img ? diaryData.img : null);

    setIsDiaryEditMode(true);

    router.push(`/diaries/edit/${diaryId}`);
  };

  const confirmDelete = (): void => {
    if (userId) {
      deleteMutation.mutate();
    } else {
      deleteFromLocal(diaryId);
      toast.on({ label: '다이어리가 삭제되었습니다' });

      router.replace(`/?form=${form}&YYMM=${YYMM}`);
    }

    modal.close();
  };

  const handleDelete = (): void => {
    modal.open({
      label: '내 기록을 삭제하면 다시 볼 수 없어요./정말 삭제하실건가요?',
      onConfirm: confirmDelete,
      onCancel: () => modal.close(),
      confirmButtonContent: {
        children: '기록 삭제하기',
        icon: (
          <svg width="16" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 17">
            <path
              d="M9.2001 3.69995C9.2001 3.38169 9.07367 3.07647 8.84863 2.85142C8.62358 2.62638 8.31836 2.49995 8.0001 2.49995C7.68184 2.49995 7.37661 2.62638 7.15157 2.85142C6.92653 3.07647 6.8001 3.38169 6.8001 3.69995H9.2001ZM6.0001 3.69995C6.0001 3.16952 6.21081 2.66081 6.58588 2.28574C6.96096 1.91066 7.46966 1.69995 8.0001 1.69995C8.53053 1.69995 9.03924 1.91066 9.41431 2.28574C9.78938 2.66081 10.0001 3.16952 10.0001 3.69995H14.0001C14.1062 3.69995 14.2079 3.74209 14.2829 3.81711C14.358 3.89212 14.4001 3.99386 14.4001 4.09995C14.4001 4.20604 14.358 4.30778 14.2829 4.38279C14.2079 4.45781 14.1062 4.49995 14.0001 4.49995H13.1569L12.7689 7.85675C12.5108 7.78592 12.2468 7.7388 11.9801 7.71595L12.3521 4.49995H3.6489L4.5929 12.684C4.63804 13.0739 4.82493 13.4336 5.11803 13.6947C5.41113 13.9558 5.78998 14.1 6.1825 14.1H7.6801C7.8273 14.3869 8.0025 14.6536 8.2057 14.9H6.1825C5.59366 14.8999 5.02539 14.6834 4.58581 14.2916C4.14623 13.8998 3.86602 13.3601 3.7985 12.7752L2.8433 4.49995H2.0001C1.89401 4.49995 1.79227 4.45781 1.71726 4.38279C1.64224 4.30778 1.6001 4.20604 1.6001 4.09995C1.6001 3.99386 1.64224 3.89212 1.71726 3.81711C1.79227 3.74209 1.89401 3.69995 2.0001 3.69995H6.0001ZM15.2001 12.1C15.2001 13.0547 14.8208 13.9704 14.1457 14.6455C13.4706 15.3207 12.5549 15.7 11.6001 15.7C10.6453 15.7 9.72964 15.3207 9.05451 14.6455C8.37938 13.9704 8.0001 13.0547 8.0001 12.1C8.0001 11.1452 8.37938 10.2295 9.05451 9.55437C9.72964 8.87924 10.6453 8.49995 11.6001 8.49995C12.5549 8.49995 13.4706 8.87924 14.1457 9.55437C14.8208 10.2295 15.2001 11.1452 15.2001 12.1ZM13.0833 11.1832C13.1584 11.108 13.2006 11.0062 13.2006 10.9C13.2006 10.7937 13.1584 10.6919 13.0833 10.6168C13.0082 10.5416 12.9063 10.4994 12.8001 10.4994C12.6939 10.4994 12.592 10.5416 12.5169 10.6168L11.6001 11.5344L10.6833 10.6168C10.6082 10.5416 10.5063 10.4994 10.4001 10.4994C10.2939 10.4994 10.192 10.5416 10.1169 10.6168C10.0418 10.6919 9.99959 10.7937 9.99959 10.9C9.99959 11.0062 10.0418 11.108 10.1169 11.1832L11.0345 12.1L10.1169 13.0168C10.0797 13.0539 10.0502 13.0981 10.0301 13.1467C10.01 13.1953 9.99959 13.2474 9.99959 13.3C9.99959 13.3525 10.01 13.4046 10.0301 13.4532C10.0502 13.5018 10.0797 13.546 10.1169 13.5832C10.1541 13.6203 10.1982 13.6498 10.2468 13.67C10.2954 13.6901 10.3475 13.7005 10.4001 13.7005C10.4527 13.7005 10.5048 13.6901 10.5534 13.67C10.602 13.6498 10.6461 13.6203 10.6833 13.5832L11.6001 12.6656L12.5169 13.5832C12.5541 13.6203 12.5982 13.6498 12.6468 13.67C12.6954 13.6901 12.7475 13.7005 12.8001 13.7005C12.8527 13.7005 12.9048 13.6901 12.9534 13.67C13.002 13.6498 13.0461 13.6203 13.0833 13.5832C13.1205 13.546 13.15 13.5018 13.1701 13.4532C13.1902 13.4046 13.2006 13.3525 13.2006 13.3C13.2006 13.2474 13.1902 13.1953 13.1701 13.1467C13.15 13.0981 13.1205 13.0539 13.0833 13.0168L12.1657 12.1L13.0833 11.1832Z"
              fill="currentColor"
            />
          </svg>
        )
      },
      cancelButtonContent: {
        children: '삭제하지 않기',
        icon: (
          <svg width="17" height="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17">
            <path
              d="M3.52096 3.8728L3.56656 3.8168C3.63284 3.75066 3.72023 3.70987 3.8135 3.70154C3.90676 3.69321 4 3.71786 4.07696 3.7712L4.13296 3.8168L8.24976 7.9344L12.3666 3.8168C12.4328 3.75066 12.5202 3.70987 12.6135 3.70154C12.7068 3.69321 12.8 3.71786 12.877 3.7712L12.933 3.8168C12.9991 3.88309 13.0399 3.97047 13.0482 4.06374C13.0566 4.15701 13.0319 4.25024 12.9786 4.3272L12.933 4.3832L8.81536 8.5L12.933 12.6168C12.9991 12.6831 13.0399 12.7705 13.0482 12.8637C13.0566 12.957 13.0319 13.0502 12.9786 13.1272L12.933 13.1832C12.8667 13.2493 12.7793 13.2901 12.686 13.2985C12.5928 13.3068 12.4995 13.2821 12.4226 13.2288L12.3666 13.1832L8.24976 9.0656L4.13296 13.1832C4.06667 13.2493 3.97928 13.2901 3.88602 13.2985C3.79275 13.3068 3.69952 13.2821 3.62256 13.2288L3.56656 13.1832C3.50042 13.1169 3.45963 13.0295 3.45129 12.9363C3.44296 12.843 3.46761 12.7498 3.52096 12.6728L3.56656 12.6168L7.68416 8.5L3.56656 4.3832C3.50042 4.31692 3.45963 4.22953 3.45129 4.13626C3.44296 4.04299 3.46761 3.94976 3.52096 3.8728Z"
              fill="currentColor"
            />
          </svg>
        )
      }
    });
  };

  return (
    <>
      <div className="block md:hidden">
        <div
          className="flex items-center justify-center h-screen w-screen"
          style={{ backgroundColor: diaryData.color }}
        >
          <div className="flex flex-col gap-custom-8px-m h-[70%]">
            <div className="flex  gap-[20vh] justify-center">
              <div className="flex  justify-center gap-[3vh]">
                <div className="w-[4vw] h-[4vw] bg-white rounded-full"></div>
                <div className="w-[4vw] h-[4vw] bg-white rounded-full"></div>
                <div className="w-[4vw] h-[4vw] bg-white rounded-full"></div>
              </div>
              <div className="flex  justify-center gap-[3vh]">
                <div className="w-[4vw] h-[4vw] bg-white rounded-full"></div>
                <div className="w-[4vw] h-[4vw] bg-white rounded-full"></div>
                <div className="w-[4vw] h-[4vw] bg-white rounded-full"></div>
              </div>
            </div>
            <div className="relative flex flex-col items-center justify-center bg-white w-360px-row-m h-[100%] rounded-[32px] border border-[#E6D3BC] p-8">
              <div className="w-[99%] h-[100%]">
                <DiaryContent diary={diaryData} />
              </div>
              <div className="absolute bottom-5 right-5 flex gap-5">
                <Button
                  onClick={handleEdit}
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  priority="secondary"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      </div>
      <div className="hidden md:block">
        <div className="flex items-center justify-center h-screen">
          <div
            className="relative flex items-center justify-center w-720px-row h-859px-col min-h-96 rounded-[32px] lg:border-4 lg:border-[#E6D3BC] p-[6.5vh] pl-[1.5vh]"
            style={{ backgroundColor: diaryData.color }}
          >
            <div className="flex flex-col gap-[20vh] w-[9%] ">
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
            <div className="relative flex flex-col items-center justify-center bg-white w-[90%] h-[100%] rounded-[32px] border border-[#E6D3BC] p-8">
              <div className="absolute flex top-6 left-7 mb-4 items-center ">
                <TextButton onClick={handleBackward}>뒤로가기</TextButton>
              </div>
              <div className="absolute top-14 left-8 w-[90%] h-[90%] items-start justify-start ">
                <DiaryContent diary={diaryData} />
              </div>
              <div className="absolute bottom-5 right-5 flex gap-5">
                <Button
                  onClick={handleEdit}
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  priority="secondary"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      </div>
    </>
  );
};

export default DiaryContainer;
