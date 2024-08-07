'use client';

import { Pie, PieChart } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Diary } from '@/types/diary.type';
import Image from 'next/image';

const ColorChart = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [sortedColors, setSortedColors] = useState<string[]>([]);
  const [colorCounts, setColorCounts] = useState<number[]>([]);
  const [length, setLength] = useState<number>(0);

  const changeDate = (changeMonth: number) => {
    if (changeMonth === 0) {
      changeMonth = 12;
      setYear(year - 1);
    } else if (changeMonth === 13) {
      changeMonth = 1;
      setYear(year + 1);
    }
    setMonth(changeMonth);
  };

  useEffect(() => {
    const getDiaries = async () => {
      try {
        const response = await axios.get<Diary[]>(`/api/diaries?year=${year}&month=${month}`);
        const diaries = response.data;
        setLength(diaries.length);

        const allColors = diaries.flatMap((entry) => entry.color);

        const counts = allColors.reduce<Record<string, number>>((acc, color) => {
          acc[color] = (acc[color] || 0) + 1;
          return acc;
        }, {});

        const sortedTagEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        setSortedColors(sortedTagEntries.map((entry) => entry[0]));
        setColorCounts(sortedTagEntries.map((entry) => entry[1]));
      } catch (error) {
        console.error('Error fetching diaries:', error);
      }
    };
    getDiaries();
  }, [year, month]);

  const chartData = [];
  for (let i = 0; i < colorCounts.length; i++) {
    chartData.push({ browser: `${i}`, visitors: colorCounts[i], fill: sortedColors[i] });
  }

  const chartConfig = {
    visitors: {
      label: 'Visitors'
    }
  } satisfies ChartConfig;
  const sortedBackgroundColors = sortedColors.map((item, index) => `bg-[${item}]`);
  return (
    <Card className="flex flex-col md:w-422px-row md:h-361px-col border border-[#E6D3BC] rounded-5xl w-[335px] h-[208px]">
      <div className="flex items-center justify-center gap-12px-row text-20px mt-24px-col">
        <button onClick={() => changeDate(month - 1)}>&lt;</button>
        {year}.{month}
        <button onClick={() => changeDate(month + 1)}>&gt;</button>
      </div>
      <CardContent>
        {sortedColors.length > 0 ? (
          (colorCounts[0] / length) * 100 < 5 ? (
            <div className="flex flex-col items-center gap-24px-col">
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-300px-col h-260px-col">
                <PieChart className="w-192px-row h-192px-col">
                  <Pie data={chartData} dataKey="visitors" />
                </PieChart>
              </ChartContainer>
              <div className="flex flex-col items-center">
                <div className="text-16px">이 달은 다양한 감정을 느끼셨나봐요.</div>
                <div className="text-16px">색상이 다채로워요!</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-300px-col h-260px-col">
                <PieChart className="w-192px-row h-192px-col">
                  <Pie data={chartData} dataKey="visitors" />
                </PieChart>
              </ChartContainer>
              <div className="flex justify-center mt-16px-col flex-wrap">
                {colorCounts.slice(0, Math.min(3, colorCounts.length)).map((item, index) => {
                  return (
                    <div key={index} className="flex items-center ml-8px-row">
                      <div className="w-20px-row h-20px-col" style={{ backgroundColor: sortedColors[index] }}></div>
                      <div className="ml-8px-row">{Math.floor((item / colorCounts.length) * 100)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          <div className="md:h-full">
            <div className="flex flex-col items-center">
              <Image
                src="/Flowers.png"
                alt="공백이미지"
                width={176}
                height={176}
                className="md:w-176px-row md:h-176px-col md:mt-24px-col md:mb-24px-col w-[120px] h-[120px]"
              />
            </div>
            <div className="md:mb-32px-col flex flex-col items-center">
              <div className="md:text-16px text-[12px]">이달은 기록된 감정이 없어요.</div>
              <div className="md:text-16px text-[12px]">더 많은 감정을 기록해봐요!</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ColorChart;
