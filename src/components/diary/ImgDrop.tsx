'use client';

import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import useZustandStore from '@/zustand/zustandStore';
import Image from 'next/image';
import heic2any from 'heic2any';

const ImgDrop = () => {
  const { img, setImg, isDiaryEditMode } = useZustandStore();
  const [preview, setPreview] = React.useState<string | null>(null);

  useEffect(() => {
    if (isDiaryEditMode) {
      if (img) {
        setPreview(img as string);
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
              setPreview(URL.createObjectURL(file));
            })
            .catch((err) => {
              console.error('Error converting HEIF image:', err);
            });
        } else {
          setImg(selectedFile);
          setPreview(URL.createObjectURL(selectedFile));
        }
      }
    },
    [setImg]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col gap-3">
      <p>Q. 오늘 감정에 맞는 이미지가 있나요?</p>
      <div
        {...getRootProps()}
        className="flex w-[120px] h-[120px] bg-slate-400 items-center justify-center rounded-2xl border-4 border-dashed border-black"
      >
        <input {...getInputProps()} />
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            width={120}
            height={120}
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <div>카메라 svg</div>
        )}
      </div>
    </div>
  );
};

export default ImgDrop;
