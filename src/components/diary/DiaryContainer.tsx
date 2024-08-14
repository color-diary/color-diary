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
import LoadingSpinner from '../common/LoadingSpinner';
import TrashBinIcon from './assets/TrashBinIcon';
import PencilIcon from './assets/PencilIcon ';
import XIconWhite from './assets/XIconWhite';
import StickerPicker from './StickerPicker';
import Sticker from './Sticker';

type StickerType = {
  id: number;
  component: JSX.Element;
  position: { x: number; y: number };
};

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
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);

  const handleStickerSelect = (sticker: Omit<StickerType, 'position'>) => {
    setStickers([...stickers, { ...sticker, position: { x: 200, y: 250 } }]);
    setIsPickerVisible(false);
  };

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

  if (isLoading || isQueryLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
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
      <div
        className="flex items-center justify-center h-screen md:pt-[80px] md:!bg-[#FEFDFB] "
        style={{ backgroundColor: diaryData.color }}
      >
        <div
          className="flex flex-col md:flex md:flex-row items-center justify-center gap-8px-col-m md:gap-16px-row md:w-720px-row md:h-807px-col rounded-[32px] md:border-4 md:border-[#E6D3BC] md:py-56px-col md:pr-56px-row md:pl-16px-row "
          style={{ backgroundColor: diaryData.color }}
        >
          <div className="flex gap-70px-row-m md:flex-col md:gap-y-320px-col md:!p-0">
            <div className="flex md:flex-col justify-center gap-16px-row-m px-24px-row-m md:gap-40px-col md:!p-0">
              <div className="w-16px-row-m h-16px-col-m md:w-32px-row md:h-32px-row bg-white rounded-full"></div>
              <div className="w-16px-row-m h-16px-col-m md:w-32px-row md:h-32px-row bg-white rounded-full"></div>
              <div className="w-16px-row-m h-16px-col-m md:w-32px-row md:h-32px-row bg-white rounded-full"></div>
            </div>
            <div className="flex md:flex-col justify-center gap-16px-row-m px-24px-row-m md:gap-40px-col md:!p-0">
              <div className="w-16px-row-m h-16px-col-m md:w-32px-row md:h-32px-row bg-white rounded-full"></div>
              <div className="w-16px-row-m h-16px-col-m md:w-32px-row md:h-32px-row bg-white rounded-full"></div>
              <div className="w-16px-row-m h-16px-col-m md:w-32px-row md:h-32px-row bg-white rounded-full"></div>
            </div>
          </div>
          <div className="relative flex flex-col flex-start justify-center w-335px-row-m h-603px-col-m px-24px-row-m py-24px-col-m bg-white md:w-600px-row md:h-696px-col rounded-[32px] border border-[#E6D3BC] md:px-60px-row md:py-40px-col md:gap-40px-col">
            {stickers.map((sticker, index) => (
              <Sticker
                key={index}
                sticker={sticker}
                onDelete={(id: number) => setStickers(stickers.filter((s) => s.id !== id))}
              />
            ))}
            <div className="md:w-480px-row md:h-530px-col">
              <div className="hidden md:block">
                <TextButton onClick={handleBackward}>뒤로가기</TextButton>
              </div>
              <div className="items-start justify-start ">
                <DiaryContent diary={diaryData} />
              </div>
            </div>
            <div className="flex justify-end gap-16px-row-m md:gap-16px-row">
              <Button onClick={handleEdit} icon={<PencilIcon />}>
                수정하기
              </Button>
              <Button onClick={handleDelete} priority="secondary" icon={<TrashBinIcon />}>
                삭제하기
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-40 right-3 hidden md:block">
          <button
            onClick={() => setIsPickerVisible(true)}
            className=" mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            편집하기
          </button>

          {isPickerVisible && <StickerPicker onSelect={handleStickerSelect} />}
          <button
            onClick={() => console.log('Stickers data: ', stickers)}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save Stickers (Disabled)
          </button>
        </div>
      </div>
    </>
  );
};

export default DiaryContainer;
