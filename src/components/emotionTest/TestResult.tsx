'use client';

import { checkHasDiaryData } from '@/apis/diary';
import results from '@/data/results';
import { useToast } from '@/providers/toast.context';
import { ResultType, TestResultProps } from '@/types/test.type';
import { formatFullDate } from '@/utils/dateUtils';
import { checkDiaryExistsForDate, checkDiaryLimit } from '@/utils/diaryLocalStorage';
import { createClient } from '@/utils/supabase/client';
import zustandStore from '@/zustand/zustandStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ShareButtons from './ShareButtons';

const TestResult = ({ emotion, positive, negative }: TestResultProps) => {
  const router = useRouter();
  const { setHasTestResult } = zustandStore();

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (error) {
          throw new Error(error.message);
        }
        if (session) {
          setUserId(session.user.id);
        }
      } catch (error) {
        console.error('Failed to get session:', error);
      }
    };

    fetchSession();
  }, [router]);
  const toast = useToast();

  const resultDetails: ResultType = results.find((result) => result.result === emotion)!;

  const handleClickWriteDiaryButton = async (): Promise<void> => {
    const date = formatFullDate();
    const hasTodayDiary = userId ? !(await checkHasDiaryData(date)) : checkDiaryExistsForDate(date);

    if (hasTodayDiary) {
      toast.on({ label: '오늘은 이미 기록작성이 완료되었어요.' });
    } else {
      const hasLimit = userId ? false : checkDiaryLimit();

      if (hasLimit) {
        toast.on({ label: '비회원은 기록을 최대 2개만 남길 수 있어요' });
      } else {
        setHasTestResult(true);
        router.push(`/diaries/write/${formatFullDate()}`);
      }
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
        <button onClick={handleClickWriteDiaryButton}>일기 작성하러 가기</button>
      </div>
      <ShareButtons emotion={resultDetails.emotion} />
    </div>
  );
};

export default TestResult;
