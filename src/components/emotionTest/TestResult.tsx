'use client';

import { checkHasDiaryData } from '@/apis/diary';
import results from '@/data/results';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/providers/toast.context';
import { ResultType, TestResultProps } from '@/types/test.type';
import { formatFullDate } from '@/utils/dateUtils';
import { checkLocalDiaryExistsForDate, isLocalDiaryOverTwo } from '@/utils/diaryLocalStorage';
import { splitCommentWithSlash } from '@/utils/splitCommentWithSlash';
import zustandStore from '@/zustand/zustandStore';
import { useRouter } from 'next/navigation';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import ProgressBar from './ProgressBar';
import ShareButtons from './ShareButtons';
import AngleRightWhite from './assets/AngleRightWhite';
import ReturnIcon from './assets/ReturnIcon';

const TestResult = ({ emotion, positive, negative }: TestResultProps) => {
  const router = useRouter();
  const { user } = useAuth();

  const { testResult, setColor, setTags, hasTestResult, setHasTestResult } = zustandStore();

  const toast = useToast();

  const resultDetails: ResultType = results.find((result) => result.result === emotion)!;

  const handleClickWriteDiaryButton = async (): Promise<void> => {
    const date = formatFullDate();
    const hasTodayDiary = user ? !(await checkHasDiaryData(date)) : checkLocalDiaryExistsForDate(date);

    if (hasTodayDiary) {
      toast.on({ label: '오늘은 이미 기록작성이 완료돠었어요. 다른날짜를 원하시면 홈으로 이동해주세요.' });
    } else {
      const hasLimit = user ? false : isLocalDiaryOverTwo();

      if (hasLimit) {
        toast.on({ label: '비회원은 기록을 최대 2개만 남길 수 있어요' });
      } else {
        if (testResult) {
          setColor(testResult.result.color);
          setTags([testResult.result.emotion]);
          setHasTestResult(true);

          router.push(`/diaries/write/${formatFullDate()}`);
        } else {
          toast.on({ label: '감정 테스트 결과를 불러오는 데 실패했어요.' });
        }
      }
    }
  };

  return (
    <div className="w-335px-row-m md:w-744px-row flex flex-col justify-center items-center gap-32px-col-m md:gap-56px-col flex-shrink-0 rounded-5xl border-4 border-border-color bg-white py-40px-col-m md:py-40px-col">
      <div className="flex flex-col items-center gap-32px-col-m md:gap-40px-col self-stretch">
        <div className="flex flex-col items-center gap-24px-col-m md:gap-52px-col self-stretch">
          <div className="flex flex-col items-center gap-16px-col-m md:gap-16px-col self-stretch">
            <h1 className="text-font-color text-18px-m md:text-28px font-bold tracking-0.36px md:tracking-0.56px">
              {resultDetails.title}
            </h1>
            <div className="flex flex-col items-center gap-8px-col-m md:gap-16px-col self-stretch">
              <span className="flex items-center justify-center w-102px-row-m h-102px-row-m md:w-200px-row md:h-200px-row">
                {resultDetails.image}
              </span>
              <div className="text-font-color text-14px-m md:text-18px font-normal tracking-0.36px text-center">
                {splitCommentWithSlash(resultDetails.comment).map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-16px-row-m md:gap-8px-row">
            <div className="flex flex-col justify-center items-start gap-8px-col">
              <span className="text-start text-font-color text-14px-m md:text-18px font-normal tracking-0.28px md:tracking-0.36px">
                긍정적 {positive}%
              </span>
              <span className="text-start text-font-color text-14px-m md:text-18px font-normal tracking-0.28px md:tracking-0.36px">
                부정적 {negative}%
              </span>
            </div>
            <div className="flex flex-col justify-center items-start gap-8px-col">
              <div className="w-200px-row-m md:w-420px-row">
                <ProgressBar value={positive} max={100} />
              </div>
              <div className="w-200px-row-m md:w-420px-row">
                <ProgressBar value={negative} max={100} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-16px-row-m md:gap-16px-row">
          <Button priority={'secondary'} href={'/emotion-test'} icon={<ReturnIcon />}>
            다시 확인하기
          </Button>
          <Button onClick={handleClickWriteDiaryButton} icon={<AngleRightWhite />}>
            일기 작성하러가기
          </Button>
          {hasTestResult && <LoadingSpinner />}
        </div>
      </div>
      <ShareButtons emotion={resultDetails.emotion} />
    </div>
  );
};

export default TestResult;
