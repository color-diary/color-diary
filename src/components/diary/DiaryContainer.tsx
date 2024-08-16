'use client';

import { fetchDiary } from '@/apis/diary';
import useAuth from '@/hooks/useAuth';
import { useModal } from '@/providers/modal.context';
import { useToast } from '@/providers/toast.context';
import { Diary } from '@/types/diary.type';
import { deleteFromLocal } from '@/utils/diaryLocalStorage';
import useZustandStore from '@/zustand/zustandStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import TextButton from '../common/TextButton';
import PencilIcon from './assets/PencilIcon ';
import TrashBinIcon from './assets/TrashBinIcon';
import XIconWhite from './assets/XIconWhite';
import DiaryContent from './DiaryContent';

const DiaryContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const diaryId = params.id as string;

  const form = searchParams.get('form');
  const YYMM = searchParams.get('YYMM');

  const toast = useToast();
  const modal = useModal();

  const { user } = useAuth();

  const { setColor, setTags, setContent, setImg, setIsDiaryEditMode } = useZustandStore();
  const [localDiary, setLocalDiary] = useState<Diary | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const readDiary = (): void => {
      if (user) {
        setUserId(user.id);
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

      setIsLoading(false);
    };

    readDiary();
  }, [router, diaryId, setColor, setTags, setContent, setImg]);

  const {
    data: diary,
    error,
    isPending: isQueryLoading
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

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (userId) {
    if (isQueryLoading) {
      return (
        <div>
          <LoadingSpinner />
        </div>
      );
    }
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
        icon: <TrashBinIcon />
      },
      cancelButtonContent: {
        children: '삭제하지 않기',
        icon: <XIconWhite />
      }
    });
  };

  return (
    <>
      <div className="block md:hidden">
        <div
          className="flex items-center justify-center h-h-screen-custom w-screen"
          style={{ backgroundColor: diaryData.color }}
        >
          <div className="flex flex-col gap-custom-8px-m h-full">
            <div className="flex gap-[20vh] justify-center">
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
                <Button onClick={handleEdit} icon={<PencilIcon />}>
                  수정하기
                </Button>
                <Button onClick={handleDelete} priority="secondary" icon={<TrashBinIcon />}>
                  삭제하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="flex items-center justify-center h-screen pt-[80px] ">
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
                <Button onClick={handleEdit} icon={<PencilIcon />}>
                  수정하기
                </Button>
                <Button onClick={handleDelete} priority="secondary" icon={<TrashBinIcon />}>
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
