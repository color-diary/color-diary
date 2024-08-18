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
import CircleUI from './CircleUI';
import { v4 as uuidv4 } from 'uuid';
import CalmSticker from './assets/emotion-stickers/CalmSticker';
import JoySticker from './assets/emotion-stickers/JoySticker';
import LethargySticker from './assets/emotion-stickers/LethargySticker';
import AnxietySticker from './assets/emotion-stickers/AnxietySticker';
import HopeSticker from './assets/emotion-stickers/HopeSticker';
import AngerSticker from './assets/emotion-stickers/AngerSticker';
import SadnessSticker from './assets/emotion-stickers/SadnessSticker';
import SmilePlusIcon from './assets/SmilePlusIcon';
import SaveIcon from './assets/SaveIcon';
import XIconBlack from './assets/XIconBlack';

type StickerType = {
  id: string;
  component: JSX.Element;
  position: { x: number; y: number };
};

type DiaryStickers = {
  id: string;
  diaryId: string;
  stickerData: StickerType[];
};

// 스티커 컴포넌트 매핑 객체
const componentMapper: Record<string, JSX.Element> = {
  CalmSticker: <CalmSticker />,
  JoySticker: <JoySticker />,
  LethargySticker: <LethargySticker />,
  AnxietySticker: <AnxietySticker />,
  HopeSticker: <HopeSticker />,
  AngerSticker: <AngerSticker />,
  SadnessSticker: <SadnessSticker />
};

const DiaryContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const diaryId = params.id as string;
  const supabase = createClient();

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
    setStickers([...stickers, { ...sticker, id: uuidv4(), position: { x: 200, y: 200 } }]);

    console.log(stickers);
    setIsPickerVisible(false);
  };

  const saveStickers = async () => {
    try {
      const stickersToSave = stickers.map((sticker) => ({
        ...sticker,
        component: sticker.component.type.name // 컴포넌트 이름 저장
      }));

      const { data: existingStickerData, error: fetchError } = await supabase
        .from('diaryStickers')
        .select('id')
        .eq('diaryId', diaryId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingStickerData) {
        const { error: updateError } = await supabase
          .from('diaryStickers')
          .update({ stickersData: stickersToSave })
          .eq('id', existingStickerData.id);

        if (updateError) {
          throw updateError;
        }

        alert('스티커가 업데이트 되었습니다');
      } else {
        const { error: insertError } = await supabase.from('diaryStickers').insert({
          diaryId,
          stickersData: stickersToSave
        });

        if (insertError) {
          throw insertError;
        }

        alert('스티커가 저장되었습니다');
      }
    } catch (error) {
      console.error('Error saving stickers:', error);
    }
  };

  const handlePositionChange = (id: string, position: { x: number; y: number }) => {
    setStickers((prevStickers) =>
      prevStickers.map((sticker) => (sticker.id === id ? { ...sticker, position } : sticker))
    );
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

    const fetchStickers = async () => {
      try {
        const { data, error } = await supabase
          .from('diaryStickers')
          .select('stickersData')
          .eq('diaryId', diaryId)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          const stickersFromDB = data.stickersData?.map((sticker: StickerType) => ({
            ...sticker,
            component: componentMapper[sticker.component] || null
          }));

          setStickers(stickersFromDB);
        }
      } catch (error) {
        console.error('Error fetching stickers:', error);
      }
    };

    fetchSession();
    fetchStickers();
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
      <div
        className="flex items-center justify-center h-h-screen-custom md:h-screen md:pt-[80px] md:!bg-[#FEFDFB] "
        style={{ backgroundColor: diaryData.color }}
      >
        <div
          className="relative flex flex-col md:flex md:flex-row items-center justify-center gap-8px-col-m md:gap-16px-row md:w-720px-row md:h-807px-col rounded-[32px] md:border-4 md:border-[#E6D3BC] md:py-56px-col md:pr-56px-row md:pl-16px-row "
          style={{ backgroundColor: diaryData.color }}
        >
          {stickers.map((sticker) => (
            <Sticker
              key={sticker.id}
              sticker={sticker}
              onDelete={(id: string) => setStickers(stickers.filter((s) => s.id !== id))}
              onPositionChange={handlePositionChange}
            />
          ))}
          <CircleUI />
          <div className="relative flex flex-col flex-start justify-center w-335px-row-m h-603px-col-m px-24px-row-m py-24px-col-m bg-white md:w-600px-row md:h-696px-col rounded-[32px] border border-[#E6D3BC] md:px-60px-row md:py-40px-col md:gap-40px-col">
            <div className="md:w-480px-row md:h-530px-col">
              <div className="flex justify-between">
                <div className="invisible md:visible">
                  <TextButton onClick={handleBackward}>뒤로가기</TextButton>
                </div>
                <div className="flex gap-12px-row-m md:gap-8px-row">
                  <button onClick={() => setIsPickerVisible(true)}>
                    <SmilePlusIcon />
                  </button>
                  <button onClick={saveStickers}>
                    <SaveIcon />
                  </button>
                </div>
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

        {isPickerVisible && (
          <div
            className="absolute inset-0 flex items-center justify-center z-50 "
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className="relative rounded-3xl bg-white border-2 border-[#E6D3BC] w-284-row-m h-310-col-m md:w-320px-row md:h-378px-col">
              <StickerPicker onSelect={handleStickerSelect} />
              <button onClick={() => setIsPickerVisible(false)} className=" absolute right-4 bottom-4 ">
                <XIconBlack />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DiaryContainer;
