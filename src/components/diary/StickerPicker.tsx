'use client';

import React from 'react';
import AngerSticker from './assets/emotion-stickers/AngerSticker';
import AnxietySticker from './assets/emotion-stickers/AnxietySticker';
import CalmSticker from './assets/emotion-stickers/CalmSticker';
import HopeSticker from './assets/emotion-stickers/HopeSticker';
import JoySticker from './assets/emotion-stickers/JoySticker';
import LethargySticker from './assets/emotion-stickers/LethargySticker';
import SadnessSticker from './assets/emotion-stickers/SadnessSticker';
import { v4 as uuidv4 } from 'uuid';

type StickerType = {
  id: string;
  component: JSX.Element;
};

// availableStickers 배열의 타입을 지정
const availableStickers: StickerType[] = [
  { id: uuidv4(), component: <CalmSticker /> },
  { id: uuidv4(), component: <JoySticker /> },
  { id: uuidv4(), component: <LethargySticker /> },
  { id: uuidv4(), component: <AnxietySticker /> },
  { id: uuidv4(), component: <HopeSticker /> },
  { id: uuidv4(), component: <AngerSticker /> },
  { id: uuidv4(), component: <SadnessSticker /> }
];

// StickerPicker 컴포넌트의 props 타입 정의
type StickerPickerProps = {
  onSelect: (sticker: StickerType) => void;
};

const StickerPicker: React.FC<StickerPickerProps> = ({ onSelect }) => {
  return (
    <>
      <div className="flex">
        {availableStickers.map((sticker) => (
          <div key={sticker.id} onClick={() => onSelect(sticker)}>
            {sticker.component}
          </div>
        ))}
      </div>
    </>
  );
};

export default StickerPicker;
