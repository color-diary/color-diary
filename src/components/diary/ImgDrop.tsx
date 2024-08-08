'use client';

import useZustandStore from '@/zustand/zustandStore';
import heic2any from 'heic2any';
import Image from 'next/image';
import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import CameraSVG from './assets/CameraSVG';

type FormValues = {
  img: File | null;
  preview: string | null;
};

const ImgDrop = () => {
  const { img, setImg, isDiaryEditMode } = useZustandStore();
  const { setValue, watch } = useForm<FormValues>({
    defaultValues: {
      img: null,
      preview: null
    }
  });

  const watchedPreview = watch('preview');

  useEffect(() => {
    if (isDiaryEditMode) {
      if (img) {
        setValue('preview', img as string);
      }
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        if (selectedFile.type === 'image/heif' || selectedFile.type === 'image/heic') {
          heic2any({ blob: selectedFile, toType: 'image/jpeg' })
            .then((result) => {
              const convertedBlob = Array.isArray(result) ? result[0] : result;
              const file = new File([convertedBlob], selectedFile.name.replace(/\.[^/.]+$/, '.jpg'), {
                type: 'image/jpeg'
              });
              setImg(file);
              setValue('img', file);
              setValue('preview', URL.createObjectURL(file));
            })
            .catch((err) => {
              console.error('Error converting HEIF image:', err);
            });
        } else {
          setImg(selectedFile);
          setValue('img', selectedFile);
          setValue('preview', URL.createObjectURL(selectedFile));
        }
      }
    },
    [setImg, setValue]
  );

  const onDelete = useCallback(() => {
    setImg(null);
    setValue('img', null);
    setValue('preview', null);
  }, [setImg, setValue]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col gap-2">
      <p className="text-16px-m md:text-18px text-font-color">Q. 오늘 감정에 맞는 이미지가 있나요?</p>
      <div
        {...getRootProps()}
        className="flex bg-[#F9F5F0] items-center justify-center rounded-[8px] border border-dashed border-[#E6D3BC] w-80px-row-m h-80px-col-m md:w-120px-row md:h-120px-row"
      >
        <input {...getInputProps()} />
        {watchedPreview ? (
          <div className="relative w-80px-row-m h-80px-col-m md:w-120px-row md:h-120px-row rounded-[8px]">
            <Image src={watchedPreview} alt="Preview" fill className="w-full h-full object-cover rounded-[8px]" />
            <button
              type="button"
              onClick={onDelete}
              className="absolute top-2 right-2 bg-red-400 text-white rounded-full p-1 text-14px"
            >
              삭제
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center md:w-120px-row md:h-120px-row">
            <p className="text-12px-m md:text-14px">이미지 첨부</p>
            <CameraSVG />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImgDrop;
