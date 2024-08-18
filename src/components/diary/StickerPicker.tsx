'use client';

import React from 'react';
import AngerSticker from './assets/emotion-stickers/AngerSticker';
import AnxietySticker from './assets/emotion-stickers/AnxietySticker';
import CalmSticker from './assets/emotion-stickers/CalmSticker';
import HopeSticker from './assets/emotion-stickers/HopeSticker';
import JoySticker from './assets/emotion-stickers/JoySticker';
import LethargySticker from './assets/emotion-stickers/LethargySticker';
import SadnessSticker from './assets/emotion-stickers/SadnessSticker';

type StickerType = {
  id: string;
  component: JSX.Element;
};

// availableStickers 배열의 타입을 지정
const availableStickers: StickerType[] = [
  { id: 'CalmSticker', component: <CalmSticker /> },
  { id: 'JoySticker', component: <JoySticker /> },
  { id: 'LethargySticker', component: <LethargySticker /> },
  { id: 'AnxietySticker', component: <AnxietySticker /> },
  { id: 'HopeSticker', component: <HopeSticker /> },
  { id: 'AngerSticker', component: <AngerSticker /> },
  { id: 'SadnessSticker', component: <SadnessSticker /> }
];

// StickerPicker 컴포넌트의 props 타입 정의
type StickerPickerProps = {
  onSelect: (sticker: StickerType) => void;
};

const StickerPicker: React.FC<StickerPickerProps> = ({ onSelect }) => {
  return (
    <>
      <div className=" grid grid-cols-3 gap-4">
        {availableStickers.map((sticker) => (
          <div key={sticker.id} onClick={() => onSelect(sticker)} className="">
            {sticker.component}
          </div>
        ))}
      </div>
    </>
  );
};

export default StickerPicker;
