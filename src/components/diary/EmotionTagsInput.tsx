'use client';

import { useState, useEffect } from 'react';
import useZustandStore from '@/zustand/zustandStore';

const EmotionTagsInput = () => {
  const { tags, setTags, isDiaryEditMode, testResult, hasTestResult, setHasTestResult } = useZustandStore();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDiaryEditMode && tags) {
      setInputValue(tags.join(' '));
    } else if (hasTestResult && testResult) {
      setInputValue(testResult.result.emotion);
      setHasTestResult(false);
    }
  }, [isDiaryEditMode, tags, hasTestResult, testResult, setHasTestResult]);

  const validateTags = (tagsArray: string[]) => {
    if (tagsArray.length > 5) {
      return '태그는 최대 5개만 입력할 수 있습니다.';
    }

    const tagPattern = /^#[\w가-힣]+$/;
    for (const tag of tagsArray) {
      if (!tagPattern.test(tag)) {
        return '태그는 #으로 시작하고, 알파벳과 한글만 포함할 수 있습니다.';
      }
    }

    return null;
  };

  const addTag = (newTag: string) => {
    const newTags = [...tags, newTag];
    const validationError = validateTags(newTags);
    if (validationError) {
      setError(validationError);
    } else {
      setError(null);
      setTags(newTags);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !tags.includes(trimmedValue)) {
        addTag(trimmedValue);
        setInputValue('');
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleTagClick = (tagToDelete: string) => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(newTags);
  };

  return (
    <div className="flex flex-col gap-3">
      <p>Q. 오늘 나의 감정태그를 작성해볼까요?</p>
      <div
        className={`w-[380px] h-[46px] flex items-center flex-wrap rounded-2xl border-2 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-[#F7F0E9] rounded px-2 py-1 mr-2 mb-1 outline-none overflow-hidden"
          >
            <span className="mr-1">{tag}</span>
            <button className="text-slate-950" onClick={() => handleTagClick(tag)}>
              x
            </button>
          </div>
        ))}
        <input
          className="flex-grow p-2 rounded outline-none overflow-hidden "
          type="text"
          placeholder="ex) #행복 #감사하는_마음 #만족"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default EmotionTagsInput;
