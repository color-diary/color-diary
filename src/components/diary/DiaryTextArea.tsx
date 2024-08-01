'use client';

import React, { useEffect, useState } from 'react';
import useZustandStore from '@/zustand/zustandStore';

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
      <p className="text-18px">Q. 오늘 나의 감정과 관련된 일을 적어주세요</p>
      <textarea
        className="w-[100%] h-[13vh] rounded-[8px] border-2 pb-8 border-gray-300 p-2 resize-none custom-scrollbar text-18px "
        placeholder="오늘의 감정과 관련된 일을 작성해주세요.
              ex)오늘의 점심이 정말 맛있었어요. 정말 행복한 하루를 보낸 것 같아요."
        value={diaryContent}
        onChange={handleContentChange}
        maxLength={500}
      />

      <div className="absolute bottom-1 right-4  text-gray-300  text-20px ">{charCount}/500</div>
    </div>
  );
};

export default DiaryTextArea;
