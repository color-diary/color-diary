import TestResult from '@/components/emotionTest/TestResult';
import { TestResultProps } from '@/types/test.type';
import { validateEmotion } from '@/utils/paramsValidation';
import { notFound } from 'next/navigation';

interface EmotionTestResultPageProps {
  searchParams: TestResultProps;
}

const EmotionTestResultPage = ({ searchParams }: EmotionTestResultPageProps) => {
  const emotion = searchParams.emotion;
  const positive = Number(searchParams.positive);
  const negative = Number(searchParams.negative);

  if (!emotion || !validateEmotion(emotion) || positive == null || negative == null || positive + negative !== 100)
    notFound();

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center">
      <TestResult emotion={emotion} positive={positive} negative={negative} />
    </div>
  );
};

export default EmotionTestResultPage;
