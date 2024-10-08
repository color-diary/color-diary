'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Diary } from '@/types/diary.type';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import { Pie, PieChart } from 'recharts';

const ColorChart = () => {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

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

  const { data: diaries = [] } = useQuery({
    queryKey: ['statisticsDiary', year, month],
    queryFn: async () => {
      const response = await axios.get<Diary[]>(`/api/diaries?year=${year}&month=${month}`);
      const diaries = response.data;
      return diaries;
    }
  });

  const length = diaries.length;
  const allColors = diaries.flatMap((entry) => entry.color);
  const counts = allColors.reduce<Record<string, number>>((acc, color) => {
    acc[color] = (acc[color] || 0) + 1;
    return acc;
  }, {});

  const sortedTagEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const sortedColors = sortedTagEntries.map((entry) => entry[0]);
  const colorCounts = sortedTagEntries.map((entry) => entry[1]);

  const chartData = [];
  for (let i = 0; i < colorCounts.length; i++) {
    chartData.push({ browser: `${i}`, visitors: colorCounts[i], fill: sortedColors[i] });
  }

  const chartConfig = {
    visitors: {
      label: 'Visitors'
    }
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col md:w-422px-row md:h-361px-col border border-[#E6D3BC] rounded-5xl w-[335px] h-[208px]">
      <div className="flex items-center justify-center md:gap-12px-row md:text-20px md:mt-24px-col gap-2 text-[16px] mt-[17px] text-font-color">
        <button onClick={() => changeDate(month - 1)}>&lt;</button>
        {year}.{month}
        <button onClick={() => changeDate(month + 1)}>&gt;</button>
      </div>
      <CardContent>
        {sortedColors.length > 0 ? (
          (colorCounts[0] / length) * 100 < 5 ? (
            <div className="flex md:flex-col items-center md:gap-24px-col flex-row justify-center mt-[24px]">
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-300px-col h-260px-col ">
                <PieChart className="md:w-192px-row md:h-192px-col w-[120px] h-[120px] ">
                  <Pie data={chartData} dataKey="visitors" />
                </PieChart>
              </ChartContainer>
              <div className="flex flex-col items-center">
                <div className="md:text-16px text-[12px] text-font-color">이 달은 다양한 감정을 느끼셨나봐요.</div>
                <div className="md:text-16px text-[12px] text-font-color">색상이 다채로워요!</div>
              </div>
            </div>
          ) : (
            <div className="flex md:flex-col md:items-center flex-row justify-center mt-[24px]">
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-300px-col h-260px-col">
                <PieChart className="md:w-192px-row md:h-192px-col w-[120px] h-[120px]">
                  <Pie data={chartData} dataKey="visitors" />
                </PieChart>
              </ChartContainer>
              <div className="flex justify-center md:flex-row md:mt-16px-col md:flex-wrap flex-col ml-[56px] gap-[8px] md:ml-0">
                {colorCounts.slice(0, Math.min(3, colorCounts.length)).map((item, index) => {
                  return (
                    <div key={index} className="flex items-center ml-8px-row">
                      <div
                        className="md:w-20px-row md:h-20px-col w-[20px] h-[20px]"
                        style={{ backgroundColor: sortedColors[index] }}
                      ></div>
                      <div className="md:ml-8px-row md:text-14px ml-[8px] text-[12px] text-font-color">
                        {Math.floor((item / colorCounts.length) * 100)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          <div className="md:h-full flex flex-row md:flex-col items-center justify-center md:justify-start mt-[24px] gap-[16px] md:gap-0">
            <div className="flex flex-col items-center">
              <Image
                src="/Flowers.svg"
                alt="공백이미지"
                width={176}
                height={176}
                className="md:w-176px-row md:h-176px-col md:mb-24px-col w-[120px] h-[120px]"
              />
            </div>
            <div className="md:mb-32px-col flex flex-col items-center">
              <div className="md:text-16px text-[12px] text-font-color">이달은 기록된 감정이 없어요.</div>
              <div className="md:text-16px text-[12px] text-font-color">더 많은 감정을 기록해봐요!</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ColorChart;
