'use client';

import results from '@/data/results';
import { useToast } from '@/providers/toast.context';
import { ResultType, TestResultProps } from '@/types/test.type';
import { formatFullDate } from '@/utils/dateUtils';
import zustandStore from '@/zustand/zustandStore';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ShareButtons from './ShareButtons';

const TestResult = ({ emotion, positive, negative }: TestResultProps) => {
  const router = useRouter();
  const { setHasTestResult } = zustandStore();

  const toast = useToast();

  const resultDetails: ResultType = results.find((result) => result.result === emotion)!;

  const checkHasDiaryData = async (): Promise<void> => {
    const { data: hasTodayDiary } = await axios.get(`/api/diaries/check?date=${formatFullDate()}`);

    if (hasTodayDiary) {
      toast.on({ label: '오늘은 이미 기록작성이 완료되었어요.' });
    } else {
      setHasTestResult(true);
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
