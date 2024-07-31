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
    },
    0: {
      label: `${(colorCounts[0] / length) * 100}%`,
      color: sortedColors[0]
    },
    1: {
      label: `${(colorCounts[1] / length) * 100}%`,
      color: sortedColors[1]
    },
    2: {
      label: `${(colorCounts[2] / length) * 100}%`,
      color: sortedColors[2]
    }
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col w-[422px] h-[361px] border border-[#E6D3BC] rounded-5xl ">
      <div className="flex items-center justify-center gap-3 text-xl mt-6">
        <button onClick={() => changeDate(month - 1)}>&lt;</button>
        {year}.{month}
        <button onClick={() => changeDate(month + 1)}>&gt;</button>
      </div>
      <CardContent>
        {sortedColors.length > 0 ? (
          sortedColors.length < 5 ? (
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px] h-[260px]">
              <PieChart>
                <Pie data={chartData} dataKey="visitors" />
                <ChartLegend
                  content={<ChartLegendContent nameKey="browser" />}
                  className="-translate-y-2 flex-wrap gap-1 [&>*]:basis-1/4 [&>*]:justify-center text-lg "
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <div>
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px] h-[260px]">
                <PieChart>
                  <Pie data={chartData} dataKey="visitors" />
                </PieChart>
              </ChartContainer>
              <div className="flex flex-col items-center">
                <div>이 달은 다양한 감정을 느끼셨나봐요.</div>
                <div>색상이 다채로워요!</div>
              </div>
            </div>
          )
        ) : (
          <div className="mb-6 h-full">
            <Image src="/Flowers.png" alt="공백이미지" width={176} height={176} className="mt-6 mb-6" />
            <div>이달은 기록된 감정이 없어요.</div>
            <div>더 많은 감정을 기록해봐요!</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ColorChart;
