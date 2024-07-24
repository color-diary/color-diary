'use client';

import React, { useEffect, useState } from 'react';
import useZustandStore from '@/zustand/zustandStore';

const DiaryTextArea = () => {
  const { content, setContent } = useZustandStore();
  const [diaryContent, setDiaryContent] = useState('');
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setDiaryContent(content);
    setCharCount(content.length);
  }, [content]);

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    if (content.length <= 500) {
      setDiaryContent(content);
      setCharCount(content.length);
      setContent(content);
    }
  };

  return (
    <div className="relative flex flex-col gap-3">
      <p>Q. 오늘 나의 감정과 관련된 일을 적어주세요</p>
      <textarea
        className="w-[380px] h-[100px] rounded-2xl border-2 border-gray-300 p-2 resize-none"
        placeholder="오늘 감정과 관련된 일을 적어주세요"
        value={diaryContent}
        onChange={handleContentChange}
        maxLength={500}
      />
      <div className="absolute bottom-2 right-4 text-gray-500 text-sm">{charCount}/500</div>
    </div>
  );
};

export default DiaryTextArea;
