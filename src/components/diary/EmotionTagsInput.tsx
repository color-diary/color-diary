'use client';

import useZustandStore from '@/zustand/zustandStore';
import { useEffect, useState } from 'react';

const EmotionTagsInput = () => {
  const { tags, setTags, isDiaryEditMode, testResult, hasTestResult, setHasTestResult } = useZustandStore();

  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDiaryEditMode) {
      setInputValue('');
    } else if (hasTestResult && testResult) {
      setHasTestResult(false);

      setInputValue(testResult.result.emotion);
    } else {
      setTags([]);
    }
  }, [isDiaryEditMode, hasTestResult, testResult, setHasTestResult, setTags]);

  const validateTags = (tagsArray: string[]) => {
    if (tagsArray.length > 5) {
      return '태그는 최대 5개만 입력할 수 있습니다.';
    }

    return null;
  };

  const addTag = (newTag: string) => {
    const newTags = [...tags, newTag];
    const validationError = validateTags(newTags);
    if (validationError) {
      setError(validationError);
    } else {
      setInputValue('');
      setTags(newTags);
      setError(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (event.nativeEvent.isComposing === false) {
        event.stopPropagation();
        const trimmedValue = inputValue.trim();
        if (trimmedValue) {
          if (!tags.includes(trimmedValue)) {
            addTag(trimmedValue);
          } else {
            setError('단어가 중복됩니다.');
          }
        } else {
          return;
        }
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    setError(null);
    if (event.target.value !== '') {
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(newTags);
  };

  return (
    <div className="flex flex-col w-[100%] gap-1">
      <p className="text-16px-m md:text-18px text-font-color">Q. 오늘 나의 감정태그를 작성해볼까요?</p>
      <div
        className={`w-[80%]  flex items-center rounded-[8px] border-2 custom-scrollbar ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        style={{ overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}
      >
        {tags?.map((tag, index) => (
          <div
            key={index}
            className="justify-between  h-20px-col-m  md:h-24px-col  ml-2 flex items-center bg-[#F7F0E9] rounded px-2 py-1 mr-2 outline-none overflow-hidden"
            style={{ flexShrink: 0 }}
          >
            <span className="text-font-color mr-1 text-14px-m md:text-20px">{tag}</span>
            <button className=" text-font-color" onClick={() => handleDeleteTag(tag)}>
              x
            </button>
          </div>
        ))}
        <textarea
          className="text-font-color flex-grow p-2 rounded  overflow-hidden resize-none outline-none text-14px-m md:text-18px w-335px-row-m h-35px-col-m md:w-552px-row md:h-40px-col"
          placeholder={tags.length === 0 ? 'ex) 행복   감사하는_마음  만족' : ''}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ minWidth: '100px' }}
        />
      </div>

      {error ? (
        <p className="text-red-500 text-12px-m md:text-18px">{error}</p>
      ) : (
        <p className="text-[#a1a1a1] text-12px-m ml-2  md:text-18px">엔터를 눌러 태그를 입력해주세요.</p>
      )}
    </div>
  );
};

export default EmotionTagsInput;
