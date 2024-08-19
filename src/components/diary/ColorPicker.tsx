'use client';

import useZustandStore from '@/zustand/zustandStore';
import { ChangeEvent, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

type FormValues = {
  customColor: string;
  pickedColor: string;
  showRainbow: boolean;
};
const ColorPicker = () => {
  const colors = ['#F05050', '#F4B557', '#FDED57', '#33D4AA', '#7BDFED', '#5B60B7', '#B77CD2'];
  const { control, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      customColor: '',
      pickedColor: '',
      showRainbow: true
    }
  });

  const { color, setColor, isDiaryEditMode, testResult, hasTestResult } = useZustandStore();
  const customColor = watch('customColor');
  const pickedColor = watch('pickedColor');
  const showRainbow = watch('showRainbow');

  useEffect(() => {
    if (isDiaryEditMode) {
      setValue('pickedColor', color);

      if (!colors.includes(color)) {
        setValue('showRainbow', false);
        setValue('customColor', color);
      } else {
        setValue('showRainbow', true);
      }
    } else if (hasTestResult && testResult) {
      setValue('pickedColor', testResult.result.color);
      setValue('showRainbow', false);
      setValue('customColor', testResult.result.color);
    }
  }, [isDiaryEditMode, color, testResult, setValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setValue('customColor', color);
    setValue('pickedColor', color);
    setValue('showRainbow', false);
    setColor(color);
  };

  const handleRainbowClick = () => {
    setValue('showRainbow', true);
  };

  const handleColor = (color: string) => {
    setValue('pickedColor', color);
    setColor(color);
  };

  return (
    <>
      <div className="flex flex-col  gap-8px-col-m md:w-552px-row md:h-72px-col md:gap-8px-col">
        <p className="text-16px-m md:text-18px text-font-color">오늘의 색은 무엇인가요?</p>
        <div className="flex justify-start gap-16px-row-m md:gap-16px-row">
          {colors.map((color) => (
            <div
              key={color}
              className={`w-24px-row-m h-24px-row-m md:w-40px-row md:h-40px-row rounded-full cursor-pointer ${
                pickedColor === color ? 'border-4 border-[#25B18C]' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColor(color)}
            />
          ))}
          {showRainbow ? (
            <Controller
              name="customColor"
              control={control}
              render={({ field }) => (
                <div
                  className="relative w-24px-row-m h-24px-row-m md:w-40px-row md:h-40px-row rounded-full overflow-hidden"
                  onClick={handleRainbowClick}
                >
                  <input
                    type="color"
                    value={field.value}
                    onChange={(e) => {
                      handleChange(e);
                      field.onChange(e);
                    }}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-24px-row-m h-24px-row-m md:w-40px-row md:h-40px-row rounded-full rainbow-gradient"></div>
                </div>
              )}
            />
          ) : (
            <div className="relative w-24px-row-m h-24px-row-m md:w-40px-row md:h-40px-row rounded-full overflow-hidden">
              <input
                type="color"
                value={customColor}
                onChange={handleChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className={`w-24px-row-m h-24px-row-m md:w-40px-row md:h-40px-row rounded-full cursor-pointer ${
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
