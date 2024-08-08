'use client';

import useZustandStore from '@/zustand/zustandStore';
import { useEffect, useState } from 'react';

const DiaryTextArea = () => {
  const { content, setContent, isDiaryEditMode } = useZustandStore();
  const [diaryContent, setDiaryContent] = useState('');
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (isDiaryEditMode) {
      setDiaryContent(content);
      setCharCount(content.length);
    }
  }, []);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    if (content.length <= 500) {
      setDiaryContent(content);
      setCharCount(content.length);
      setContent(content);
    }
  };

  return (
    <div className="relative flex flex-col w-[100%] gap-1">
      <p className="text-16px-m md:text-18px text-font-color">Q. 오늘 나의 감정과 관련된 일을 적어주세요</p>
      <div className="border-gray-300 border-2 rounded-[8px] w-335px-row-m bg-white  md:w-[100%]">
        <textarea
          className="text-font-color w-full  md:w-[100%] md:h-[10.5vh] rounded-[8px] pb-8  p-2 resize-none custom-scrollbar text-14px-m md:text-18px outline-none"
          placeholder="오늘의 감정과 관련된 일을 작성해주세요.
            ex)오늘의 점심이 정말 맛있었어요. 정말 행복한 하루를 보낸 것 같아요."
          value={diaryContent}
          onChange={handleContentChange}
          maxLength={500}
        />
        <div className="w-full h-3  rounded-[8px]">
          <div className=" rounded-[8px] absolute bottom-1 right-4  text-gray-300 text-12px-m md:text-20px ">
            {charCount}/500
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryTextArea;
