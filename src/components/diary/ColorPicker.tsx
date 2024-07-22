'use client';

import React, { useState } from 'react';
import useZustandStore from '@/zustand/zustandStore';

const ColorPicker = () => {
  const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
  const [customColor, setCustomColor] = useState('');
  const [showRainbow, setShowRainbow] = useState(true);
  const [pickedColor, setPickedColor] = useState('');

  const { setColor } = useZustandStore(); // Zustand 스토어의 setColor 함수 가져오기

  console.log(pickedColor);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setCustomColor(color);
    setPickedColor(color);
    setShowRainbow(false);
    setColor(color); // Zustand 스토어에 색상 저장
  };

  const handleRainbowClick = () => {
    setShowRainbow(true);
  };

  const handleColor = (color: string) => {
    setPickedColor(color);
    setColor(color); // Zustand 스토어에 색상 저장
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <p>Q. 오늘의 색은 무엇인가요?</p>
        <div className="flex space-x-2 items-center">
          <br />
          {colors.map((color) => (
            <div
              key={color}
              className={`w-[40px] h-[40px] rounded-full cursor-pointer ${
                pickedColor === color ? 'border-4 border-black' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColor(color)}
            />
          ))}
          {showRainbow ? (
            <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden" onClick={handleRainbowClick}>
              <input
                type="color"
                value={customColor}
                onChange={handleChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-[40px] h-[40px] rounded-full rainbow-gradient"></div>
            </div>
          ) : (
            <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden">
              <input
                type="color"
                value={customColor}
                onChange={handleChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className={`w-[40px] h-[40px] rounded-full cursor-pointer ${
                  pickedColor === customColor ? 'border-4 border-black' : ''
                }`}
                style={{ backgroundColor: customColor }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ColorPicker;
