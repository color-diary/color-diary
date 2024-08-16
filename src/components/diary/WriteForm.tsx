'use client';

import { checkHasDiaryData } from '@/apis/diary';
import ColorPicker from '@/components/diary/ColorPicker';
import ImgDrop from '@/components/diary/ImgDrop';
import useAuth from '@/hooks/useAuth';
import { useModal } from '@/providers/modal.context';
import { useToast } from '@/providers/toast.context';
import { NewDiary } from '@/types/diary.type';
import { tZustandStore } from '@/types/zustandStore.type';
import {
  checkLocalDiaryExistsForDate,
  isLocalDiaryOverTwo,
  saveToLocal,
  updateLocalDiary
} from '@/utils/diaryLocalStorage';
import { urlToFile } from '@/utils/imageFileUtils';
import useZustandStore from '@/zustand/zustandStore';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import TextButton from '../common/TextButton';
import DiaryTextArea from './DiaryTextArea';
import EmotionTagsInput from './EmotionTagsInput';
import AngelRightBlack from './assets/AngelRightBlack';
import AngleRightGreen from './assets/AngleRightGreen';
import BackArrowIcon from './assets/BackArrowIcon';
import PencilIcon from './assets/PencilIcon ';
import XIconWhite from './assets/XIconWhite';

const WriteForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const date = params.id as string;
  const diaryId = params.id as string;

  const toast = useToast();
  const modal = useModal();

  const { user } = useAuth();

  const form = searchParams.get('form');
  const YYMM = searchParams.get('YYMM');

  const { color, tags, content, img, isDiaryEditMode, setIsDiaryEditMode, hasTestResult, setHasTestResult } =
    useZustandStore((state: tZustandStore) => ({
      color: state.color,
      tags: state.tags,
      content: state.content,
      img: state.img,
      isDiaryEditMode: state.isDiaryEditMode,
      setIsDiaryEditMode: state.setIsDiaryEditMode,
      hasTestResult: state.hasTestResult,
      setHasTestResult: state.setHasTestResult
    }));

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkDiary = async (): Promise<void> => {
      if (user) {
        if (!isDiaryEditMode) {
          const hasTodayDiary = await checkHasDiaryData(date);
          if (!hasTodayDiary) {
            toast.on({ label: '오늘은 이미 기록작성이 완료돠었어요. 다른날짜를 원하시면 홈으로 이동해주세요.' });
            router.replace(`/?form=${form}&YYMM=${YYMM}`);
          }
        }
      } else {
        if (!isDiaryEditMode) {
          if (checkLocalDiaryExistsForDate(date)) {
            toast.on({ label: '오늘은 이미 기록작성이 완료돠었어요. 다른날짜를 원하시면 홈으로 이동해주세요.' });

            router.replace(`/?form=${form}&YYMM=${YYMM}`);
          } else if (isLocalDiaryOverTwo()) {
            toast.on({ label: '비회원은 기록을 최대 2개만 남길 수 있어요.' });

            router.replace(`/?form=${form}&YYMM=${YYMM}`);
          }
        }
      }

      setIsLoading(false);
    };
    checkDiary();
  }, [user, isDiaryEditMode, date, router]);

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
      toast.on({ label: isDiaryEditMode ? '나의 감정이 수정되었어요.' : '나의 감정이 기록되었어요.' });

      if (hasTestResult) router.replace('/');
      else router.replace(`/?form=${form}&YYMM=${YYMM}`);

      setIsDiaryEditMode(false);
      setHasTestResult(false);
    },
    onError: () => {
      toast.on({ label: '작성 실패.' });
    }
  });

  const handleWrite = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (color && tags.length > 0 && content) {
      if (!user) {
        saveToLocal(color, tags, content, img, date);

        toast.on({ label: '나의 감정이 기록되었어요' });

        if (hasTestResult) {
          router.replace('/');
        } else {
          router.replace(`/?form=${form}&YYMM=${YYMM}`);
        }

        return;
      }
      if (!isDiaryEditMode) {
        mutation.mutate({
          userId: user.id,
          color,
          tags,
          content,
          img,
          date
        });
      }
    } else {
      toast.on({ label: '색상, 태그, 글 모두 입력해주세요' });
    }
  };

  const handleEdit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (color && tags.length > 0 && content) {
      if (!user) {
        updateLocalDiary(diaryId, color, tags, content, img, date);
        router.replace(`/?form=${form}&YYMM=${YYMM}`);
        toast.on({ label: '나의 감정이 수정되었어요.' });

        return;
      }

      mutation.mutate({
        userId: user.id,
        color,
        tags,
        content,
        img,
        date
      });
    } else {
      toast.on({ label: '색상, 태그, 글 모두 입력해주세요' });
    }
  };

  const confirmBackward = (): void => {
    modal.close();
    router.back();
    setIsDiaryEditMode(false);
    setHasTestResult(false);
  };

  const handleBackward = (): void => {
    modal.open({
      label: '뒤로가면 입력한 내용이 취소될 수 있어요./뒤로 가실건가요?',
      onConfirm: confirmBackward,
      onCancel: () => modal.close(),
      confirmButtonContent: {
        children: '뒤로가기',
        icon: <BackArrowIcon />
      },
      cancelButtonContent: {
        children: '계속 작성하기',
        icon: <XIconWhite />
      }
    });
  };

  const routeToEmotionTest = (): void => {
    modal.close();
    void router.replace('/emotion-test');
  };

  const handlePreventEmotionTest = (): void => {
    modal.open({
      label: '페이지를 나가시면 입력한 내용이 취소될 수 있어요./나의 감정을 확인하러 가실 건가요?',
      onConfirm: routeToEmotionTest,
      onCancel: () => modal.close(),
      confirmButtonContent: {
        children: '감정 확인하기',
        icon: <AngleRightGreen />
      },
      cancelButtonContent: {
        children: '계속 작성하기',
        icon: <XIconWhite />
      }
    });
  };

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <form className="block md:hidden" onSubmit={(e) => (isDiaryEditMode ? handleEdit(e) : handleWrite(e))}>
        <div className="relative flex flex-col items-center justify-center h-h-screen-custom">
          <div className="flex flex-col gap-24px-col-m md:gap-24px-col w-335px-row-m ">
            <ColorPicker />
            <EmotionTagsInput />
            <DiaryTextArea />
            <ImgDrop />
            <div>
              <p className="mb-2 text-14px-m text-font-color">오늘 나의 감정이 궁금하다면?</p>
              <div onClick={handlePreventEmotionTest}>
                <Button size="md" priority="secondary" type="button" icon={<AngelRightBlack />}>
                  나의 감정 확인하기
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-5 right-5">
            <Button size="md" type="submit" icon={<PencilIcon />}>
              {isDiaryEditMode ? '수정 완료하기' : '작성 완료하기'}
            </Button>
          </div>
        </div>
      </form>
      <form className="hidden md:block" onSubmit={(e) => (isDiaryEditMode ? handleEdit(e) : handleWrite(e))}>
        <div className="flex items-center justify-center h-screen">
          <div className="w-744px-row h-807px-col px-72px-row pb-72px-col pt-40px-col rounded-[32px] flex flex-col items-center justify-center bg-[#FBF8F4] border-4 border-[#E6D3BC]">
            <div className="flex flex-col gap-16px-row">
              <div className="flex h-46px-col  w-600px-row  justify-between items-center">
                <div className="flex items-center ml-24px-row ">
                  <TextButton onClick={handleBackward} type="button">
                    뒤로가기
                  </TextButton>
                </div>
                <div className="mr-24px-row">
                  <Button size="md" type="submit" icon={<PencilIcon />}>
                    {isDiaryEditMode ? '수정 완료하기' : '작성 완료하기'}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col  items-start justify-start pt-24px-col pb-24px-col pl-24px-row pr-24px-row bg-white w-600px-row h-633px-col rounded-[32px] border border-[#E6D3BC] ">
                <div className="flex flex-col gap-24px-col">
                  <ColorPicker />
                  <EmotionTagsInput />
                  <DiaryTextArea />
                  <div className="relative flex w-552px-row h-152px-col ">
                    <ImgDrop />
                    <div className="absolute right-0 bottom-0 flex flex-col justify-center items-center">
                      <p className="mb-2 text-14px text-font-color">오늘 나의 감정이 궁금하다면?</p>
                      <div onClick={handlePreventEmotionTest}>
                        <Button size="md" type="button" priority="secondary" icon={<AngelRightBlack />}>
                          나의 감정 확인하기
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default WriteForm;
