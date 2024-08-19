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
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  isDeleteVisible: boolean;
};

const Sticker: React.FC<StickerProps> = ({ sticker, onDelete, onPositionChange, isDeleteVisible }) => {
  return (
    <Draggable
      defaultPosition={{ x: sticker.position.x, y: sticker.position.y }}
      onStop={(e, data) => {
        onPositionChange(sticker.id, { x: data.x, y: data.y });
      }}
      bounds="parent"
    >
      <div className=" relative z-20 cursor-move" style={{ position: 'absolute' }}>
        {isDeleteVisible && (
          <button onClick={() => onDelete(sticker.id)} className="absolute -top-4 -right-3 ">
            <XIconBlack />
          </button>
        )}

        <div className="aspect-ratio">{sticker.component}</div>
      </div>
    </Draggable>
  );
};

export default Sticker;
