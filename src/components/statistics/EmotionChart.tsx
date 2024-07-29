'use client';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Diary } from '@/types/diary.type';

const EmotionChart = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [sortedTags, setSortedTags] = useState<string[]>([]);
  const [tagCounts, setTagCounts] = useState<number[]>([]);
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
        console.log(response.data);
        const diaries = response.data;
        setLength(diaries.length);
        const allTags = diaries.flatMap((entry) => entry.tags);

        const counts = allTags.reduce<Record<string, number>>((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        }, {});

        const sortedTagEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

        setSortedTags(sortedTagEntries.map((entry) => entry[0]));
        setTagCounts(sortedTagEntries.map((entry) => entry[1]));
      } catch (error) {
        console.error('Error fetching diaries:', error);
      }
    };
    getDiaries();
  }, [year, month]);

  const chartData = [];
  for (let i = 0; i < Math.min(sortedTags.length, 3); i++) {
    chartData.push({ browser: sortedTags[i], visitors: tagCounts[i], fill: 'blue' });
  }

  const chartConfig = {
    visitors: {
      label: '태그 수'
    },
    [sortedTags[0]]: {
      label: sortedTags[0],
      color: 'hsl(var(--chart-1))'
    },
    [sortedTags[1]]: {
      label: sortedTags[1],
      color: 'hsl(var(--chart-2))'
    },
    [sortedTags[2]]: {
      label: sortedTags[2],
      color: 'hsl(var(--chart-3))'
    }
  } satisfies ChartConfig;

  return (
    <Card>
      <div className="flex items-center justify-center gap-3 mt-6 text-lg">
        <button onClick={() => changeDate(month - 1)}>&lt;</button>
        {year}.{month}
        <button onClick={() => changeDate(month + 1)}>&gt;</button>
      </div>
      <div className="flex justify-center items-center">
        <CardContent>
          {sortedTags.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[150px] w-[450px] mt-[40px]">
              <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                  left: 0
                }}
                className="font-bold text-lg"
              >
                <YAxis
                  dataKey="browser"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                />
                <XAxis dataKey="visitors" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="visitors" layout="vertical" radius={[0, 15, 15, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="mt-[64px] flex flex-col items-center">             
              <div className="text-[#25B18C] ">#이달은_감정기록이_필요해</div>
              <div className="mt-4">아직 감정 해시태그가 기록되지 않았어요.</div>
              <div>감정 해시태그를 추가하면 자기 이해와 관리에 도움이 될 수 있답니다.</div>
              <div>오늘의 감정을 해시태그로 표현해보세요!</div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default EmotionChart;
