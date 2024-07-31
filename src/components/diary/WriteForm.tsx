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
import {
  checkLocalDiaryExistsForDate,
  isLocalDiaryOverTwo,
  saveToLocal,
  updateLocalDiary
} from '@/utils/diaryLocalStorage';
import { checkHasDiaryData } from '@/apis/diary';
import EmotionTagsInput from './EmotionTagsInput';
import DiaryTextArea from './DiaryTextArea';
import TextButton from '../common/TextButton';
import Button from '../common/Button';
import { useToast } from '@/providers/toast.context';

const WriteForm = () => {
  const router = useRouter();
  const params = useParams();
  const date = params.id as string;
  const diaryId = params.id as string;
  const toast = useToast();

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
        if (!isDiaryEditMode) {
          const hasTodayDiary = await checkHasDiaryData(date);
          if (!hasTodayDiary) {
            toast.on({ label: '(회원)이미 일기를 작성하셨네요' });
            router.replace('/');
          }
        }
      } else {
        if (!isDiaryEditMode) {
          if (checkLocalDiaryExistsForDate(date)) {
            toast.on({ label: '(비회원)이미 일기를 작성하셨네요!' });

            router.replace('/');
          } else if (isLocalDiaryOverTwo()) {
            toast.on({ label: '비회원은 최대 2개의 다이어리만 작성할 수 있습니다.' });

            router.replace('/');
          }
        }
      }
    };
    checkDiary();
  }, [userId, isDiaryEditMode, date, router]);

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
      toast.on({ label: isDiaryEditMode ? '수정 완료' : '작성 완료' });
      setIsDiaryEditMode(false);
      router.replace('/');
    },
    onError: (error: Error) => {
      toast.on({ label: '작성 실패. 다시 시도해 주세요.' });
    }
  });

  const handleWrite = () => {
    if (!color || !tags) {
      toast.on({ label: '색상과 태그를 입력해주세요' });
      return;
    }
    if (!userId) {
      saveToLocal(color, tags, content, img, date);
      toast.on({ label: '(비회원)작성완료!' });

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
    if (!color || !tags) {
      toast.on({ label: '색상과 태그를 입력해주세요' });
      return;
    }
    if (!userId) {
      updateLocalDiary(diaryId, color, tags, content, img, date);
      router.replace('/');
      toast.on({ label: '비회원 수정완료.' });

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
      <div className="flex flex-col items-center justify-center bg-[#F9F5F0] border-4 border-[#E6D3BC] w-[82vh] h-[90vh] rounded-[32px]">
        <div className="flex gap-80 mb-4">
          <div className="flex items-center gap-2 ">
            <TextButton onClick={handleBackward}>뒤로가기</TextButton>
          </div>

          <Button
            size="md"
            onClick={isDiaryEditMode ? handleEdit : handleWrite}
            icon={
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18.6159 1.51123C18.2877 1.16589 17.8937 0.889755 17.457 0.699088C17.0204 0.508422 16.55 0.407083 16.0736 0.401044C15.5972 0.395005 15.1244 0.484388 14.6831 0.663926C14.2418 0.843463 13.8408 1.10952 13.5039 1.44643L2.25394 12.6964C1.86127 13.0897 1.58865 13.5867 1.46794 14.1292L0.414342 18.8692C0.392305 18.9679 0.395535 19.0704 0.423733 19.1675C0.45193 19.2645 0.504181 19.3529 0.575638 19.4243C0.647095 19.4958 0.735443 19.548 0.832485 19.5762C0.929527 19.6044 1.03212 19.6077 1.13074 19.5856L5.84194 18.538C6.40329 18.4143 6.91728 18.1319 7.32274 17.7244L16.8987 8.14843L17.3031 8.55163C17.5281 8.77666 17.6545 9.08183 17.6545 9.40003C17.6545 9.71822 17.5281 10.0234 17.3031 10.2484L16.1751 11.3764C16.066 11.4897 16.0057 11.6414 16.0073 11.7987C16.0089 11.956 16.0722 12.1064 16.1836 12.2175C16.295 12.3286 16.4456 12.3915 16.6029 12.3927C16.7603 12.3938 16.9117 12.3331 17.0247 12.2236L18.1515 11.0956C18.6015 10.6456 18.8542 10.0352 18.8542 9.39883C18.8542 8.76243 18.6015 8.15209 18.1515 7.70203L17.7483 7.29883L18.5523 6.49483C19.2106 5.83632 19.5855 4.94671 19.5971 4.01572C19.6088 3.08472 19.2575 2.18601 18.6159 1.51123ZM14.3511 2.29483C14.7967 1.85563 15.3978 1.61041 16.0234 1.61266C16.649 1.6149 17.2484 1.86442 17.6908 2.3068C18.1332 2.74918 18.3827 3.34853 18.3849 3.97415C18.3872 4.59976 18.1419 5.20089 17.7027 5.64643L6.47434 16.876C6.23022 17.1222 5.9202 17.2926 5.58154 17.3668L1.78954 18.2092L2.63914 14.3896C2.71004 14.0694 2.8712 13.7763 3.10354 13.5448L14.3511 2.29483Z"
                  fill="white"
                />
              </svg>
            }
          >
            {isDiaryEditMode ? '수정하기' : '작성완료'}
          </Button>
        </div>
        <div className=" relative flex flex-col gap-5 items-start justify-start p-3 pl-5 bg-white w-[37vw] h-[75vh] rounded-[32px] border border-[#E6D3BC]  mb-6">
          <div className="flex flex-col gap-7">
            <ColorPicker />
            <EmotionTagsInput />
            <DiaryTextArea />
            <ImgDrop />
          </div>
          <div className="absolute bottom-0 right-0 flex flex-col justify-center items-center p-4">
            <p className="mb-2 text-20px">오늘 나의 감정이 궁금하다면?</p>
            <Link href="/emotion-test">
              <Button
                size="md"
                priority="secondary"
                icon={
                  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="icon/angle-right">
                      <path
                        id="Vector"
                        d="M7.64589 4.14689C7.73953 4.05303 7.8666 4.00019 7.99919 4C8.13177 3.99981 8.259 4.05229 8.35289 4.14589L13.8369 9.61089C13.8881 9.66199 13.9288 9.72269 13.9566 9.78953C13.9843 9.85637 13.9986 9.92803 13.9986 10.0004C13.9986 10.0728 13.9843 10.1444 13.9566 10.2113C13.9288 10.2781 13.8881 10.3388 13.8369 10.3899L8.35289 15.8549C8.25847 15.9458 8.13209 15.9961 8.00099 15.9948C7.86989 15.9934 7.74455 15.9407 7.65197 15.8478C7.5594 15.755 7.50699 15.6295 7.50604 15.4984C7.50509 15.3673 7.55567 15.2411 7.64689 15.1469L12.8119 9.99989L7.64689 4.85389C7.55303 4.76026 7.50019 4.63318 7.5 4.5006C7.49981 4.36802 7.55229 4.24079 7.64589 4.14689Z"
                        fill="currentColor"
                      />
                    </g>
                  </svg>
                }
              >
                나의 감정 확인하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteForm;
