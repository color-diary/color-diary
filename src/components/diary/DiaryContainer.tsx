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
import StickerPicker from './StickerPicker';
import Sticker from './Sticker';
import CircleUI from './CircleUI';
import { v4 as uuidv4 } from 'uuid';
import CalmSticker from './assets/diary-stickers/CalmSticker';
import JoySticker from './assets/diary-stickers/JoySticker';
import LethargySticker from './assets/diary-stickers/LethargySticker';
import AnxietySticker from './assets/diary-stickers/AnxietySticker';
import HopeSticker from './assets/diary-stickers/HopeSticker';
import AngerSticker from './assets/diary-stickers/AngerSticker';
import SadnessSticker from './assets/diary-stickers/SadnessSticker';
import SmilePlusIcon from './assets/SmilePlusIcon';
import SaveIcon from './assets/SaveIcon';
import XIconBlack from './assets/XIconBlack';
import { createClient } from '@/utils/supabase/client';
import TipBubble from './assets/TipBubble';
import SpringFlowerSticker from './assets/diary-stickers/SpringFlowerSticker';
import WinterFlowerSticker from './assets/diary-stickers/WinterFlowerSticker';
import SummerFlowerSticker from './assets/diary-stickers/SummerFlowerSticker';
import FallFlowerSticker from './assets/diary-stickers/FallFlowerSticker';
import SeedSticker from './assets/diary-stickers/SeedSticker';
import LogoSticker from './assets/diary-stickers/LogoSticker';
import ColorInsideTextSticker from './assets/diary-stickers/ColorInsideTextSticker';
import HappyDayTextSticker from './assets/diary-stickers/HappyDayTextSticker';
import DoAnythingSticker from './assets/diary-stickers/DoAnythingSticker';
import TextSeedSticker from './assets/diary-stickers/TextSeedSticker';
import TextGoodJobSticker from './assets/diary-stickers/TextGoodJobSticker';
import NoThoughtSticker from './assets/diary-stickers/NoThoughtSticker';
import SpecialDaySticker from './assets/diary-stickers/SpecialDaySticker';
import SpecialMeSticker from './assets/diary-stickers/SpecialMeSticker';
import PreciousMeSticker from './assets/diary-stickers/PreciousMeSticker';
import NaSticker from './assets/diary-stickers/NaSticker';

type StickerType = {
  id: string;
  component: JSX.Element;
  position: { x: number; y: number };
};

type StickerDataType = {
  id: string;
  component: string;
  position: { x: number; y: number };
};

const componentMapper: Record<string, JSX.Element> = {
  SpringFlowerSticker: <SpringFlowerSticker />,
  WinterFlowerSticker: <WinterFlowerSticker />,
  SummerFlowerSticker: <SummerFlowerSticker />,
  FallFlowerSticker: <FallFlowerSticker />,
  AnxietySticker: <AnxietySticker />,
  SadnessSticker: <SadnessSticker />,
  SeedSticker: <SeedSticker />,
  JoySticker: <JoySticker />,
  LogoSticker: <LogoSticker />,
  HopeSticker: <HopeSticker />,
  LethargySticker: <LethargySticker />,
  AngerSticker: <AngerSticker />,
  CalmSticker: <CalmSticker />,
  ColorInsideTextSticker: <ColorInsideTextSticker />,
  HappyDayTextSticker: <HappyDayTextSticker />,
  DoAnythingSticker: <DoAnythingSticker />,
  TextSeedSticker: <TextSeedSticker />,
  TextGoodJobSticker: <TextGoodJobSticker />,
  NoThoughtSticker: <NoThoughtSticker />,
  SpecialDaySticker: <SpecialDaySticker />,
  SpecialMeSticker: <SpecialMeSticker />,
  PreciousMeSticker: <PreciousMeSticker />,
  NaSticker: <NaSticker />
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

  const { user } = useAuth();

  const { setColor, setTags, setContent, setImg, setIsDiaryEditMode } = useZustandStore();
  const [localDiary, setLocalDiary] = useState<Diary | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);
  const [isTipVisible, setIsTipVisible] = useState(true);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  const handleStickerSelect = (sticker: Omit<StickerType, 'position'>) => {
    setStickers([...stickers, { ...sticker, id: uuidv4(), position: { x: 130, y: 160 } }]);

    setIsPickerVisible(false);
  };

  const handlePositionChange = (id: string, position: { x: number; y: number }) => {
    setStickers((prevStickers) =>
      prevStickers.map((sticker) => (sticker.id === id ? { ...sticker, position } : sticker))
    );
  };

  const handleSaveStickers = async () => {
    try {
      const stickersToSave = stickers.map((sticker) => ({
        ...sticker,
        component: sticker.component.type.displayName as string
      }));

      const { data: existingStickerData, error: fetchError } = await supabase
        .from('diaryStickers')
        .select('id')
        .eq('diaryId', diaryId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (stickersToSave.length === 0) {
        if (existingStickerData) {
          await supabase.from('diaryStickers').delete().eq('id', existingStickerData.id);

          toast.on({ label: '스티커가 삭제되었습니다' });
        }
      } else {
        if (existingStickerData) {
          const { error: updateError } = await supabase
            .from('diaryStickers')
            .update({ stickersData: stickersToSave })
            .eq('id', existingStickerData.id);

          if (updateError) {
            throw updateError;
          }

          toast.on({ label: '스티커가 업데이트 되었습니다' });
        } else {
          const { error: insertError } = await supabase.from('diaryStickers').insert({
            diaryId,
            stickersData: stickersToSave
          });

          if (insertError) {
            throw insertError;
          }
          toast.on({ label: '스티커가 저장되었습니다' });
        }
      }
    } catch (error) {
      console.error('Error saving stickers:', error);
    }
  };

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

        if (data && Array.isArray(data.stickersData)) {
          const stickersFromDB = (data.stickersData as StickerDataType[]).map((sticker) => ({
            ...sticker,
            component: componentMapper[sticker.component as keyof typeof componentMapper] || null
          }));

          setStickers(stickersFromDB);
        }
      } catch (error) {
        console.error('Error fetching stickers:', error);
      }
    };

    readDiary();

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
    return <p>본인이 쓴 글이 아님</p>;
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
              isDeleteVisible={isDeleteVisible}
            />
          ))}
          <CircleUI />
          <div className="relative flex flex-col flex-start justify-center w-335px-row-m h-603px-col-m px-24px-row-m py-24px-col-m bg-white md:w-600px-row md:h-696px-col rounded-[32px] border border-[#E6D3BC] md:px-60px-row md:py-40px-col md:gap-40px-col">
            <div className="md:w-480px-row md:h-530px-col">
              <div className="flex justify-between">
                <div className="invisible md:visible">
                  <TextButton onClick={handleBackward}>뒤로가기</TextButton>
                </div>
                <div className="relative flex gap-12px-row-m md:gap-8px-row">
                  {userId && (
                    <>
                      <button
                        onClick={() => {
                          setIsPickerVisible(true);
                          setIsDeleteVisible(true);
                        }}
                      >
                        <SmilePlusIcon />
                      </button>
                      {isTipVisible && (
                        <div
                          onClick={() => setIsTipVisible(false)}
                          className="absolute -top-12 -right-5 cursor-pointer z-50"
                        >
                          <TipBubble />
                        </div>
                      )}
                      <button
                        onClick={() => {
                          handleSaveStickers();
                          setIsDeleteVisible(false);
                        }}
                      >
                        <SaveIcon />
                      </button>
                    </>
                  )}
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
            <div className="relative rounded-[32px] bg-white border-2 border-[#E6D3BC] w-284px-row-m h-310px-col-m md:w-320px-row md:h-auto">
              <div className="flex justify-center border-b-2 border-[#E6D3BC] px-10px-row-m py-12px-col-m md:px-12px-col md:py-12px-col">
                <p className="text-14px-m md:text-16px">스티커 모음집</p>
                <SmilePlusIcon />
              </div>
              <div className="py-24px-col-m px-16px-row-m md:px-24px-row md:pt-40px-col justify-center">
                <StickerPicker onSelect={handleStickerSelect} />
              </div>
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
