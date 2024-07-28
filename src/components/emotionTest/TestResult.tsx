'use client';

import { checkHasDiaryData } from '@/apis/diary';
import results from '@/data/results';
import { useToast } from '@/providers/toast.context';
import { ResultType, TestResultProps } from '@/types/test.type';
import { formatFullDate } from '@/utils/dateUtils';
import { checkLocalDiaryExistsForDate, isLocalDiaryOverTwo } from '@/utils/diaryLocalStorage';
import { splitCommentWithSlash } from '@/utils/splitCommentWithSlash';
import { createClient } from '@/utils/supabase/client';
import zustandStore from '@/zustand/zustandStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../common/Button';
import EmotionIcon from './EmotionIcon';
import ProgressBar from './ProgressBar';
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
            <EmotionIcon emotion={emotion} />
            <div className="text-font-color text-xl font-normal tracking-tight text-center">
              {splitCommentWithSlash(resultDetails.comment).map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
          <div className="w-550px flex flex-col items-start gap-2">
            <div className="w-full flex justify-between items-center gap-6">
              <span className="w-32 text-font-color text-xl font-normal tracking-tight">긍정적 {positive}%</span>
              <div className="w-430px">
                <ProgressBar value={positive} max={100} />
              </div>
            </div>
            <div className="w-full flex justify-between items-center gap-6">
              <span className="w-32 text-font-color text-xl font-normal tracking-tight">부정적 {negative}%</span>
              <div className="w-430px">
                <ProgressBar value={negative} max={100} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button href={'/emotion-test'}>다시 확인하기</Button>
          <Button onClick={handleClickWriteDiaryButton}>일기 작성하러가기</Button>
        </div>
      </div>
      <ShareButtons emotion={resultDetails.emotion} />
    </div>
  );
};

export default TestResult;
