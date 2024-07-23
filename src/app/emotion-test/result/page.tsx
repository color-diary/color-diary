import TestResult from '@/components/emotionTest/TestResult';
import { Emotion } from '@/types/test.type';
import { notFound } from 'next/navigation';

type EmotionTestResultPageParams = {
  emotion: Emotion;
  positive: string;
  negative: string;
};

interface EmotionTestResultPageProps {
  searchParams: EmotionTestResultPageParams;
}

const EmotionTestResultPage = ({ searchParams }: EmotionTestResultPageProps) => {
  const emotion = searchParams.emotion;
  const positive = Number(searchParams.positive);
  const negative = Number(searchParams.negative);

  if (!emotion || !positive || !negative || positive + negative !== 100) notFound();

  return <TestResult emotion={emotion} positive={positive} negative={negative} />;
};

export default EmotionTestResultPage;
