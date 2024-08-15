'use client';

import React from 'react';
import Draggable from 'react-draggable';
import XIconBlack from './assets/XIconBlack';

type StickerType = {
  id: string;
  component: JSX.Element;
  position: { x: number; y: number };
};

type StickerProps = {
  sticker: StickerType;
  onDelete: (id: string) => void;
};

const Sticker: React.FC<StickerProps> = ({ sticker, onDelete }) => {
  return (
    <Draggable
      defaultPosition={{ x: sticker.position.x, y: sticker.position.y }}
      onStop={(e, data) => {
        // 스티커 위치 업데이트 로직
        console.log(`Sticker moved to x: ${data.x}, y: ${data.y}`);
      }}
      bounds="parent"
    >
      <div className="relative z-20 cursor-move " style={{ position: 'absolute' }}>
        <button onClick={() => onDelete(sticker.id)}>
          <XIconBlack />
        </button>
        <div className="aspect-ratio">{sticker.component}</div>
      </div>
    </Draggable>
  );
};

export default Sticker;
