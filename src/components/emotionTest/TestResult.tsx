'use client';

import results from '@/data/results';
import { ResultType, TestResultProps } from '@/types/test.type';
import { formatFullDate } from '@/utils/dateUtils';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ShareButtons from './ShareButtons';

const TestResult = ({ emotion, positive, negative }: TestResultProps) => {
  const router = useRouter();

  const resultDetails: ResultType = results.find((result) => result.result === emotion)!;

  const checkHasDiaryData = async (): Promise<void> => {
    const { data: hasTodayDiary } = await axios.get(`/api/diaries/check?date=${formatFullDate()}`);

    if (hasTodayDiary) {
      alert('오늘 이미 일기를 작성하셨네요!');
    } else {
      router.push(`/diaries/write/${formatFullDate()}`);
    }
  };

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
        <button onClick={checkHasDiaryData}>일기 작성하러 가기</button>
      </div>
      <ShareButtons emotion={resultDetails.emotion} />
    </div>
  );
};

export default TestResult;
