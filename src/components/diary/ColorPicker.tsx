'use client';

import useZustandStore from '@/zustand/zustandStore';
import { useEffect, useState } from 'react';

const ColorPicker = () => {
  const colors = ['#F05050', '#F1883C', '#FBED12', '#55F896', '#7BDFED', '#444EE9', '#B979EC'];
  const [customColor, setCustomColor] = useState('');
  const [showRainbow, setShowRainbow] = useState(true);
  const [pickedColor, setPickedColor] = useState('');

  const { color, setColor, isDiaryEditMode, testResult, hasTestResult, setHasTestResult } = useZustandStore();

  useEffect(() => {
    if (isDiaryEditMode) {
      setPickedColor(color);

      if (!colors.includes(color)) {
        setShowRainbow(false);
        setCustomColor(color);
      } else {
        setShowRainbow(true);
      }
    } else if (hasTestResult && testResult) {
      setPickedColor(testResult.result.color);

      setShowRainbow(false);
      setCustomColor(testResult.result.color);

      setHasTestResult(false);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setCustomColor(color);
    setPickedColor(color);
    setShowRainbow(false);
    setColor(color);
  };

  const handleRainbowClick = () => {
    setShowRainbow(true);
  };

  const handleColor = (color: string) => {
    setPickedColor(color);
    setColor(color);
  };

  return (
    <>
      <div className="flex flex-col gap-3 text-20px">
        <p>오늘의 색은 무엇인가요?</p>
        <div className="flex space-x-2 items-center">
          <br />
          {colors.map((color) => (
            <div
              key={color}
              className={`w-[2.7vw] h-[2.7vw] rounded-full cursor-pointer ${
                pickedColor === color ? 'border-4 border-[#25B18C]' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColor(color)}
            />
          ))}
          {showRainbow ? (
            <div className="relative w-[2.7vw] h-[2.7vw] rounded-full overflow-hidden" onClick={handleRainbowClick}>
              <input
                type="color"
                value={customColor}
                onChange={handleChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-[2.7vw] h-[2.7vw] rounded-full rainbow-gradient"></div>
            </div>
          ) : (
            <div className="relative w-[2.7vw] h-[2.7vw] rounded-full overflow-hidden">
              <input
                type="color"
                value={customColor}
                onChange={handleChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className={`w-[2.7vw] h-[2.7vw] rounded-full cursor-pointer ${
                  pickedColor === customColor ? 'border-4 border-[#25B18C]' : ''
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
