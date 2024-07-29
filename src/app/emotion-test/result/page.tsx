import TestResult from '@/components/emotionTest/TestResult';
import { TestResultProps } from '@/types/test.type';
import { notFound } from 'next/navigation';

interface EmotionTestResultPageProps {
  searchParams: TestResultProps;
}

const EmotionTestResultPage = ({ searchParams }: EmotionTestResultPageProps) => {
  const emotion = searchParams.emotion;
  const positive = Number(searchParams.positive);
  const negative = Number(searchParams.negative);

  if (!emotion || positive == null || negative == null || positive + negative !== 100) notFound();

  return (
    <div className="h-screen flex justify-center items-center">
      <TestResult emotion={emotion} positive={positive} negative={negative} />
    </div>
  );
};

export default EmotionTestResultPage;
