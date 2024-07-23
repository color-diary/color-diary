'use client';

import React, { useState } from 'react';
import useZustandStore from '@/zustand/zustandStore';

const EmotionTagsInput = () => {
  const { setTags } = useZustandStore();
  const [emotionTags, setEmotionTags] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 태그 유효성 검사 함수
  const validateTags = (tags: string) => {
    // 보류 const tagsArray = tags.match(/#[\w가-힣]+/g) || [];

    // 한글이나 영어로 시작하는 태그가 있는지 검사
    if (!/#[\w가-힣]+/g.test(tags)) {
      return '태그를 붙어주세요';
    }

    // 첫 번째 패턴으로 태그 추출
    const tagsArray1 = tags.match(/#[\w가-힣]+/g) || [];
    // 두 번째 패턴으로 태그 추출
    const tagsArray2 = tags.match(/# [\w가-힣]+/g) || [];

    // 두 배열을 합친 후 중복 태그 제거
    const tagsArray = Array.from(new Set([...tagsArray1, ...tagsArray2]));

    // 태그가 5개 이하인지 확인
    if (tagsArray.length > 5) {
      return '태그는 최대 5개만 입력할 수 있습니다.';
    }

    // 태그가 #으로 시작하고, 알파벳과 한글만 포함하는지 확인
    const tagPattern = /^#[\w가-힣]+$/;
    for (const tag of tagsArray) {
      if (!tagPattern.test(tag)) {
        return '태그는 #으로 시작하고, 알파벳과 한글만 포함할 수 있습니다.';
      }
    }

    return null;
  };

  const handleTags = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    // 유효성 검사
    const validationError = validateTags(input);

    if (validationError) {
      setError(validationError);
    } else {
      setError(null);
    }

    const tagsArray = (input.match(/#[\w가-힣]+/g) || []).map((tag) => tag.trim());
    setEmotionTags(input);
    setTags(tagsArray);
  };

  return (
    <div className="flex flex-col gap-3">
      <p>Q. 오늘 나의 감정태그를 작성해볼까요?</p>
      <input
        className={`w-[380px] h-[46px] rounded-2xl border-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
        type="text"
        placeholder="#복잡해 #행복해 #기쁨"
        value={emotionTags}
        onChange={handleTags}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default EmotionTagsInput;
