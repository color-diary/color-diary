'use client';

import useZustandStore from '@/zustand/zustandStore';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

type FormValues = {
  diaryContent: string;
};

const DiaryTextArea = () => {
  const { content, setContent, isDiaryEditMode } = useZustandStore();
  const { control, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      diaryContent: ''
    }
  });

  const diaryContent = watch('diaryContent');
  const charCount = diaryContent?.length || 0;

  useEffect(() => {
    if (isDiaryEditMode) {
      setValue('diaryContent', content);
    }
  }, [isDiaryEditMode, content, setValue]);

  const handleContentChange = (value: string) => {
    if (value.length <= 500) {
      setValue('diaryContent', value);
      setContent(value);
    }
  };

  return (
    <div className=" flex flex-col gap-8px-col-m md:w-552px-row md:gap-8px-col">
      <p className="text-16px-m md:text-18px text-font-color md:h-24px-col">Q. 나의 감정에 있었던 일은 무엇이었나요?</p>
      <div className="flex flex-col px-8px-col-m py-16px-row-m gap-8px-col-m md:gap-8px-col border-[#A1A1A1] border rounded-[8px] w-335px-row-m h-135px-col-m bg-white md:w-552px-row md:h-160px-col md:py-8px-col  md:px-16px-row ">
        <Controller
          name="diaryContent"
          control={control}
          render={({ field }) => (
            <textarea
              className="text-font-color w-full h-102px-col-m md:h-148px-col rounded-[8px] resize-none custom-scrollbar text-14px-m md:text-18px outline-none"
              placeholder="오늘의 감정과 관련된 일을 작성해주세요.
              ex)오늘의 점심이 정말 맛있었어요. 정말 행복한 하루를 보낸 것 같아요."
              value={field.value}
              onChange={(e) => handleContentChange(e.target.value)}
              maxLength={500}
            />
          )}
        />
        <div className="relative h-12px-col-m md:h-12px-col rounded-[8px]">
          <div className="rounded-[8px] absolute bottom--1 md:bottom-0 right-1 text-gray-400 text-12px-m md:text-14px">
            {charCount}/500
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryTextArea;
