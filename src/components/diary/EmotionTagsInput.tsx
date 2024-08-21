'use client';

import useZustandStore from '@/zustand/zustandStore';
import { ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import XIconBlack from './assets/XIconBlack';

type FormValues = {
  inputValue: string;
  tags: string[];
};

const EmotionTagsInput = () => {
  const { isDiaryEditMode, hasTestResult, testResult, tags, setTags } = useZustandStore();

  const {
    control,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      inputValue: '',
      tags: []
    }
  });

  const inputValue = watch('inputValue');
  const watchedTags = watch('tags', tags);

  useEffect(() => {
    if (isDiaryEditMode) {
      setValue('inputValue', '');
      setValue('tags', tags);
    } else if (hasTestResult && testResult) {
      setValue('inputValue', '');
      setValue('tags', tags);
    } else {
      setTags([]);
      setValue('tags', []);
    }
  }, [isDiaryEditMode, testResult, setValue]);

  const validateTags = (tagsArray: string[]) => {
    if (tagsArray.length > 5) {
      return '태그는 최대 5개만 입력할 수 있습니다.';
    }
    return null;
  };

  const addTag = (newTag: string) => {
    const newTags = [...watchedTags, newTag];
    const validationError = validateTags(newTags);
    if (validationError) {
      setError('tags', { type: 'manual', message: validationError });
    } else {
      setValue('inputValue', '');
      setTags(newTags);
      setValue('tags', newTags);
      clearErrors('tags');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (event.nativeEvent.isComposing === false) {
        event.stopPropagation();
        const trimmedValue = inputValue.trim();
        if (trimmedValue) {
          if (!watchedTags.includes(trimmedValue)) {
            addTag(trimmedValue);
          } else {
            setError('tags', { type: 'manual', message: '단어가 중복됩니다.' });
          }
        }
      }
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue('inputValue', event.target.value);
    clearErrors('tags');
  };

  const handleDeleteTag = (tagToDelete: string) => {
    const newTags = watchedTags.filter((tag) => tag !== tagToDelete);
    setTags(newTags);
    setValue('tags', newTags);
  };

  return (
    <div className="flex flex-col gap-8px-col-m md:w-552px-row md:h-94px-col md:gap-8px-col">
      <p className="text-16px-m md:text-18px text-font-color">Q. 오늘 나의 감정 태그를 작성해 볼까요?</p>
      <div
        className={`bg-white flex items-center w-335px-row-m h-35px-col-m  md:w-552px-row md:h-35px-col px-16px-row-m  py-8px-col-m gap-12px-row-m md:py-8px-col  md:px-16px-row md:gap-16px-row rounded-[8px] border custom-scrollbar focus-within:border-gray-900 ${
          errors.tags ? 'border-red-500' : 'border-[#A1A1A1]'
        }`}
        style={{ overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}
      >
        {watchedTags.map((tag, index) => (
          <div
            key={index}
            className="flex justify-between h-20px-col-m gap-4px-row-m  md:h-24px-col md:gap-4px-row  items-center bg-[#F7F0E9] rounded outline-none overflow-hidden"
            style={{ flexShrink: 0 }}
          >
            <span className="text-font-color pl-8px-row-m  text-14px-m md:pl-0 md:text-16px md:ml-8px-row ">{tag}</span>
            <button
              type="button"
              className="text-font-color text-12px-m md:text-16px pr-8px-row-m md:pr-0 md:mr-8px-row"
              onClick={() => handleDeleteTag(tag)}
            >
              <XIconBlack />
            </button>
          </div>
        ))}
        <Controller
          name="inputValue"
          control={control}
          render={({ field }) => (
            <textarea
              className="pt-8px-col-m text-font-color items-center justify-center outline-none rounded overflow-hidden resize-none  text-14px-m md:text-16px w-335px-row-m h-35px-col-m md:w-552px-row md:h-35px-col md:py-8px-col "
              placeholder={watchedTags.length === 0 ? 'ex) 행복   감사하는_마음  만족' : ''}
              value={field.value}
              onChange={(e) => {
                handleInputChange(e);
                field.onChange(e);
              }}
              onKeyDown={handleKeyDown}
              style={{ minWidth: '100px' }}
            />
          )}
        />
      </div>
      {errors.tags ? (
        <p className="text-red-500 text-14px-m md:text-16px">{errors.tags.message}</p>
      ) : (
        <p className="text-[#a1a1a1] text-14px-m md:text-16px">엔터를 눌러 태그를 입력해주세요.</p>
      )}
    </div>
  );
};

export default EmotionTagsInput;
