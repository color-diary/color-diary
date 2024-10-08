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
    <div className="h-h-screen-custom md:h-screen flex justify-center items-center">
      <TestResult emotion={emotion} positive={positive} negative={negative} />
    </div>
  );
};

export default EmotionTestResultPage;
