'use client';

import { checkHasDiaryData } from '@/apis/diary';
import results from '@/data/results';
import { useToast } from '@/providers/toast.context';
import { ResultType, TestResultProps } from '@/types/test.type';
import { formatFullDate } from '@/utils/dateUtils';
import { checkLocalDiaryExistsForDate, isLocalDiaryOverTwo } from '@/utils/diaryLocalStorage';
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
    const hasTodayDiary = userId ? !(await checkHasDiaryData(date)) : checkLocalDiaryExistsForDate(date);

    if (hasTodayDiary) {
      toast.on({ label: '오늘은 이미 기록작성이 완료돠었어요. 다른날짜를 원하시면 홈으로 이동해주세요.' });
    } else {
      const hasLimit = userId ? false : isLocalDiaryOverTwo();

      if (hasLimit) {
        toast.on({ label: '비회원은 기록을 최대 2개만 남길 수 있어요' });
      } else {
        setHasTestResult(true);
        router.push(`/diaries/write/${formatFullDate()}`);
      }
    }
  };

  return (
    <div className="w-744px h-760px flex flex-col justify-center items-center gap-14 flex-shrink-0 rounded-5xl border-4 border-border-color bg-white">
      <div className="flex flex-col items-center gap-10 self-stretch">
        <div className="flex flex-col items-center gap-13 self-stretch">
          <div className="flex flex-col items-center gap-4 self-stretch">
            <h1 className="text-font-color text-28px font-bold -tracking-0.56px">{resultDetails.title}</h1>
            <div
              className="w-200px h-200px flex justify-center items-center rounded-full border-4"
              style={{ background: `${resultDetails.color}`, borderColor: `${resultDetails.borderColor}` }}
            >
              {resultDetails.image}
            </div>
            <p>{resultDetails.comment}</p>
          </div>
          <div>
            <p>{positive}</p>
            <p>{negative}</p>
          </div>
        </div>
        <div>
          <Link href={'/emotion-test'}>다시 테스트하기</Link>
          <button onClick={handleClickWriteDiaryButton}>일기 작성하러 가기</button>
        </div>
      </div>
      <ShareButtons emotion={resultDetails.emotion} />
    </div>
  );
};

export default TestResult;
