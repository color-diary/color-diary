'use client';

import results from '@/data/results';
import { Emotion, ResultType } from '@/types/test.type';
import { formatDate } from '@/utils/dateUtils';
import Link from 'next/link';

interface TestResultProps {
  emotion: Emotion;
  positive: number;
  negative: number;
}

const TestResult = ({ emotion, positive, negative }: TestResultProps) => {
  const resultDetails: ResultType = results.find((result) => result.result === emotion)!;

  return (
    <div>
      <div>
        <h1>{resultDetails.emotion}</h1>
        <p>{resultDetails.comment}</p>
      </div>
      <div>
        <p>{positive}</p>
        <p>{negative}</p>
      </div>
      <div>
        <Link href={'/emotion-test'}>다시 테스트하기</Link>
        <Link href={`/diaries/write/${formatDate()}`}>일기 작성하러 가기</Link>
      </div>
    </div>
  );
};

export default TestResult;
