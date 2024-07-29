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
          <Button
            href={'/emotion-test'}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
                <path
                  d="M6.49992 15.9999C6.49992 16.1325 6.5526 16.2597 6.64636 16.3535C6.74013 16.4472 6.86731 16.4999 6.99992 16.4999H11.4999C13.1359 16.4999 14.3999 15.8819 15.2489 14.9259C16.0899 13.9789 16.4999 12.7319 16.4999 11.4999C16.4999 10.2679 16.0899 9.0199 15.2489 8.0739C14.3989 7.1179 13.1359 6.4999 11.4999 6.4999H6.20692L8.85392 3.8539C8.9004 3.80741 8.93728 3.75222 8.96244 3.69148C8.9876 3.63074 9.00055 3.56564 9.00055 3.4999C9.00055 3.43416 8.9876 3.36906 8.96244 3.30832C8.93728 3.24758 8.9004 3.19239 8.85392 3.1459C8.80743 3.09941 8.75224 3.06254 8.6915 3.03738C8.63076 3.01222 8.56566 2.99927 8.49992 2.99927C8.43417 2.99927 8.36907 3.01222 8.30833 3.03738C8.24759 3.06254 8.19241 3.09941 8.14592 3.1459L4.64592 6.6459C4.59935 6.69234 4.56241 6.74752 4.5372 6.80827C4.512 6.86901 4.49902 6.93413 4.49902 6.9999C4.49902 7.06567 4.512 7.13079 4.5372 7.19153C4.56241 7.25228 4.59935 7.30745 4.64592 7.3539L8.14592 10.8539C8.2398 10.9478 8.36714 11.0005 8.49992 11.0005C8.63269 11.0005 8.76003 10.9478 8.85392 10.8539C8.9478 10.76 9.00055 10.6327 9.00055 10.4999C9.00055 10.3671 8.9478 10.2398 8.85392 10.1459L6.20692 7.4999H11.4999C12.8639 7.4999 13.8499 8.0069 14.5009 8.7379C15.1599 9.4799 15.4999 10.4819 15.4999 11.4999C15.4999 12.5179 15.1599 13.5199 14.5009 14.2619C13.8509 14.9929 12.8639 15.4999 11.4999 15.4999H6.99992C6.86731 15.4999 6.74013 15.5526 6.64636 15.6463C6.5526 15.7401 6.49992 15.8673 6.49992 15.9999Z"
                  fill="currentColor"
                />
                <path
                  d="M6.49992 15.9999C6.49992 16.1325 6.5526 16.2597 6.64636 16.3535C6.74013 16.4472 6.86731 16.4999 6.99992 16.4999H11.4999C13.1359 16.4999 14.3999 15.8819 15.2489 14.9259C16.0899 13.9789 16.4999 12.7319 16.4999 11.4999C16.4999 10.2679 16.0899 9.0199 15.2489 8.0739C14.3989 7.1179 13.1359 6.4999 11.4999 6.4999H6.20692L8.85392 3.8539C8.9004 3.80741 8.93728 3.75222 8.96244 3.69148C8.9876 3.63074 9.00055 3.56564 9.00055 3.4999C9.00055 3.43416 8.9876 3.36906 8.96244 3.30832C8.93728 3.24758 8.9004 3.19239 8.85392 3.1459C8.80743 3.09941 8.75224 3.06254 8.6915 3.03738C8.63076 3.01222 8.56566 2.99927 8.49992 2.99927C8.43417 2.99927 8.36907 3.01222 8.30833 3.03738C8.24759 3.06254 8.19241 3.09941 8.14592 3.1459L4.64592 6.6459C4.59935 6.69234 4.56241 6.74752 4.5372 6.80827C4.512 6.86901 4.49902 6.93413 4.49902 6.9999C4.49902 7.06567 4.512 7.13079 4.5372 7.19153C4.56241 7.25228 4.59935 7.30745 4.64592 7.3539L8.14592 10.8539C8.2398 10.9478 8.36714 11.0005 8.49992 11.0005C8.63269 11.0005 8.76003 10.9478 8.85392 10.8539C8.9478 10.76 9.00055 10.6327 9.00055 10.4999C9.00055 10.3671 8.9478 10.2398 8.85392 10.1459L6.20692 7.4999H11.4999C12.8639 7.4999 13.8499 8.0069 14.5009 8.7379C15.1599 9.4799 15.4999 10.4819 15.4999 11.4999C15.4999 12.5179 15.1599 13.5199 14.5009 14.2619C13.8509 14.9929 12.8639 15.4999 11.4999 15.4999H6.99992C6.86731 15.4999 6.74013 15.5526 6.64636 15.6463C6.5526 15.7401 6.49992 15.8673 6.49992 15.9999Z"
                  fill="currentColor"
                />
                <path
                  d="M6.49992 15.9999C6.49992 16.1325 6.5526 16.2597 6.64636 16.3535C6.74013 16.4472 6.86731 16.4999 6.99992 16.4999H11.4999C13.1359 16.4999 14.3999 15.8819 15.2489 14.9259C16.0899 13.9789 16.4999 12.7319 16.4999 11.4999C16.4999 10.2679 16.0899 9.0199 15.2489 8.0739C14.3989 7.1179 13.1359 6.4999 11.4999 6.4999H6.20692L8.85392 3.8539C8.9004 3.80741 8.93728 3.75222 8.96244 3.69148C8.9876 3.63074 9.00055 3.56564 9.00055 3.4999C9.00055 3.43416 8.9876 3.36906 8.96244 3.30832C8.93728 3.24758 8.9004 3.19239 8.85392 3.1459C8.80743 3.09941 8.75224 3.06254 8.6915 3.03738C8.63076 3.01222 8.56566 2.99927 8.49992 2.99927C8.43417 2.99927 8.36907 3.01222 8.30833 3.03738C8.24759 3.06254 8.19241 3.09941 8.14592 3.1459L4.64592 6.6459C4.59935 6.69234 4.56241 6.74752 4.5372 6.80827C4.512 6.86901 4.49902 6.93413 4.49902 6.9999C4.49902 7.06567 4.512 7.13079 4.5372 7.19153C4.56241 7.25228 4.59935 7.30745 4.64592 7.3539L8.14592 10.8539C8.2398 10.9478 8.36714 11.0005 8.49992 11.0005C8.63269 11.0005 8.76003 10.9478 8.85392 10.8539C8.9478 10.76 9.00055 10.6327 9.00055 10.4999C9.00055 10.3671 8.9478 10.2398 8.85392 10.1459L6.20692 7.4999H11.4999C12.8639 7.4999 13.8499 8.0069 14.5009 8.7379C15.1599 9.4799 15.4999 10.4819 15.4999 11.4999C15.4999 12.5179 15.1599 13.5199 14.5009 14.2619C13.8509 14.9929 12.8639 15.4999 11.4999 15.4999H6.99992C6.86731 15.4999 6.74013 15.5526 6.64636 15.6463C6.5526 15.7401 6.49992 15.8673 6.49992 15.9999Z"
                  fill="currentColor"
                />
                <path
                  d="M6.49992 15.9999C6.49992 16.1325 6.5526 16.2597 6.64636 16.3535C6.74013 16.4472 6.86731 16.4999 6.99992 16.4999H11.4999C13.1359 16.4999 14.3999 15.8819 15.2489 14.9259C16.0899 13.9789 16.4999 12.7319 16.4999 11.4999C16.4999 10.2679 16.0899 9.0199 15.2489 8.0739C14.3989 7.1179 13.1359 6.4999 11.4999 6.4999H6.20692L8.85392 3.8539C8.9004 3.80741 8.93728 3.75222 8.96244 3.69148C8.9876 3.63074 9.00055 3.56564 9.00055 3.4999C9.00055 3.43416 8.9876 3.36906 8.96244 3.30832C8.93728 3.24758 8.9004 3.19239 8.85392 3.1459C8.80743 3.09941 8.75224 3.06254 8.6915 3.03738C8.63076 3.01222 8.56566 2.99927 8.49992 2.99927C8.43417 2.99927 8.36907 3.01222 8.30833 3.03738C8.24759 3.06254 8.19241 3.09941 8.14592 3.1459L4.64592 6.6459C4.59935 6.69234 4.56241 6.74752 4.5372 6.80827C4.512 6.86901 4.49902 6.93413 4.49902 6.9999C4.49902 7.06567 4.512 7.13079 4.5372 7.19153C4.56241 7.25228 4.59935 7.30745 4.64592 7.3539L8.14592 10.8539C8.2398 10.9478 8.36714 11.0005 8.49992 11.0005C8.63269 11.0005 8.76003 10.9478 8.85392 10.8539C8.9478 10.76 9.00055 10.6327 9.00055 10.4999C9.00055 10.3671 8.9478 10.2398 8.85392 10.1459L6.20692 7.4999H11.4999C12.8639 7.4999 13.8499 8.0069 14.5009 8.7379C15.1599 9.4799 15.4999 10.4819 15.4999 11.4999C15.4999 12.5179 15.1599 13.5199 14.5009 14.2619C13.8509 14.9929 12.8639 15.4999 11.4999 15.4999H6.99992C6.86731 15.4999 6.74013 15.5526 6.64636 15.6463C6.5526 15.7401 6.49992 15.8673 6.49992 15.9999Z"
                  fill="currentColor"
                />
                <path
                  d="M6.49992 15.9999C6.49992 16.1325 6.5526 16.2597 6.64636 16.3535C6.74013 16.4472 6.86731 16.4999 6.99992 16.4999H11.4999C13.1359 16.4999 14.3999 15.8819 15.2489 14.9259C16.0899 13.9789 16.4999 12.7319 16.4999 11.4999C16.4999 10.2679 16.0899 9.0199 15.2489 8.0739C14.3989 7.1179 13.1359 6.4999 11.4999 6.4999H6.20692L8.85392 3.8539C8.9004 3.80741 8.93728 3.75222 8.96244 3.69148C8.9876 3.63074 9.00055 3.56564 9.00055 3.4999C9.00055 3.43416 8.9876 3.36906 8.96244 3.30832C8.93728 3.24758 8.9004 3.19239 8.85392 3.1459C8.80743 3.09941 8.75224 3.06254 8.6915 3.03738C8.63076 3.01222 8.56566 2.99927 8.49992 2.99927C8.43417 2.99927 8.36907 3.01222 8.30833 3.03738C8.24759 3.06254 8.19241 3.09941 8.14592 3.1459L4.64592 6.6459C4.59935 6.69234 4.56241 6.74752 4.5372 6.80827C4.512 6.86901 4.49902 6.93413 4.49902 6.9999C4.49902 7.06567 4.512 7.13079 4.5372 7.19153C4.56241 7.25228 4.59935 7.30745 4.64592 7.3539L8.14592 10.8539C8.2398 10.9478 8.36714 11.0005 8.49992 11.0005C8.63269 11.0005 8.76003 10.9478 8.85392 10.8539C8.9478 10.76 9.00055 10.6327 9.00055 10.4999C9.00055 10.3671 8.9478 10.2398 8.85392 10.1459L6.20692 7.4999H11.4999C12.8639 7.4999 13.8499 8.0069 14.5009 8.7379C15.1599 9.4799 15.4999 10.4819 15.4999 11.4999C15.4999 12.5179 15.1599 13.5199 14.5009 14.2619C13.8509 14.9929 12.8639 15.4999 11.4999 15.4999H6.99992C6.86731 15.4999 6.74013 15.5526 6.64636 15.6463C6.5526 15.7401 6.49992 15.8673 6.49992 15.9999Z"
                  fill="currentColor"
                />
                <path
                  d="M6.49992 15.9999C6.49992 16.1325 6.5526 16.2597 6.64636 16.3535C6.74013 16.4472 6.86731 16.4999 6.99992 16.4999H11.4999C13.1359 16.4999 14.3999 15.8819 15.2489 14.9259C16.0899 13.9789 16.4999 12.7319 16.4999 11.4999C16.4999 10.2679 16.0899 9.0199 15.2489 8.0739C14.3989 7.1179 13.1359 6.4999 11.4999 6.4999H6.20692L8.85392 3.8539C8.9004 3.80741 8.93728 3.75222 8.96244 3.69148C8.9876 3.63074 9.00055 3.56564 9.00055 3.4999C9.00055 3.43416 8.9876 3.36906 8.96244 3.30832C8.93728 3.24758 8.9004 3.19239 8.85392 3.1459C8.80743 3.09941 8.75224 3.06254 8.6915 3.03738C8.63076 3.01222 8.56566 2.99927 8.49992 2.99927C8.43417 2.99927 8.36907 3.01222 8.30833 3.03738C8.24759 3.06254 8.19241 3.09941 8.14592 3.1459L4.64592 6.6459C4.59935 6.69234 4.56241 6.74752 4.5372 6.80827C4.512 6.86901 4.49902 6.93413 4.49902 6.9999C4.49902 7.06567 4.512 7.13079 4.5372 7.19153C4.56241 7.25228 4.59935 7.30745 4.64592 7.3539L8.14592 10.8539C8.2398 10.9478 8.36714 11.0005 8.49992 11.0005C8.63269 11.0005 8.76003 10.9478 8.85392 10.8539C8.9478 10.76 9.00055 10.6327 9.00055 10.4999C9.00055 10.3671 8.9478 10.2398 8.85392 10.1459L6.20692 7.4999H11.4999C12.8639 7.4999 13.8499 8.0069 14.5009 8.7379C15.1599 9.4799 15.4999 10.4819 15.4999 11.4999C15.4999 12.5179 15.1599 13.5199 14.5009 14.2619C13.8509 14.9929 12.8639 15.4999 11.4999 15.4999H6.99992C6.86731 15.4999 6.74013 15.5526 6.64636 15.6463C6.5526 15.7401 6.49992 15.8673 6.49992 15.9999Z"
                  fill="currentColor"
                />
              </svg>
            }
          >
            다시 확인하기
          </Button>
          <Button
            onClick={handleClickWriteDiaryButton}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21">
                <path
                  d="M8.14589 4.64689C8.23953 4.55303 8.3666 4.50019 8.49919 4.5C8.63177 4.49981 8.759 4.55229 8.85289 4.64589L14.3369 10.1109C14.3881 10.162 14.4288 10.2227 14.4566 10.2895C14.4843 10.3564 14.4986 10.428 14.4986 10.5004C14.4986 10.5728 14.4843 10.6444 14.4566 10.7113C14.4288 10.7781 14.3881 10.8388 14.3369 10.8899L8.85289 16.3549C8.75847 16.4458 8.63209 16.4961 8.50099 16.4948C8.36989 16.4934 8.24455 16.4407 8.15197 16.3478C8.0594 16.255 8.00699 16.1295 8.00604 15.9984C8.00509 15.8673 8.05567 15.7411 8.14689 15.6469L13.3119 10.4999L8.14689 5.35389C8.05303 5.26026 8.00019 5.13318 8 5.0006C7.99981 4.86802 8.05229 4.74079 8.14589 4.64689Z"
                  fill="currentColor"
                />
                <path
                  d="M8.14589 4.64689C8.23953 4.55303 8.3666 4.50019 8.49919 4.5C8.63177 4.49981 8.759 4.55229 8.85289 4.64589L14.3369 10.1109C14.3881 10.162 14.4288 10.2227 14.4566 10.2895C14.4843 10.3564 14.4986 10.428 14.4986 10.5004C14.4986 10.5728 14.4843 10.6444 14.4566 10.7113C14.4288 10.7781 14.3881 10.8388 14.3369 10.8899L8.85289 16.3549C8.75847 16.4458 8.63209 16.4961 8.50099 16.4948C8.36989 16.4934 8.24455 16.4407 8.15197 16.3478C8.0594 16.255 8.00699 16.1295 8.00604 15.9984C8.00509 15.8673 8.05567 15.7411 8.14689 15.6469L13.3119 10.4999L8.14689 5.35389C8.05303 5.26026 8.00019 5.13318 8 5.0006C7.99981 4.86802 8.05229 4.74079 8.14589 4.64689Z"
                  fill="currentColor"
                />
                <path
                  d="M8.14589 4.64689C8.23953 4.55303 8.3666 4.50019 8.49919 4.5C8.63177 4.49981 8.759 4.55229 8.85289 4.64589L14.3369 10.1109C14.3881 10.162 14.4288 10.2227 14.4566 10.2895C14.4843 10.3564 14.4986 10.428 14.4986 10.5004C14.4986 10.5728 14.4843 10.6444 14.4566 10.7113C14.4288 10.7781 14.3881 10.8388 14.3369 10.8899L8.85289 16.3549C8.75847 16.4458 8.63209 16.4961 8.50099 16.4948C8.36989 16.4934 8.24455 16.4407 8.15197 16.3478C8.0594 16.255 8.00699 16.1295 8.00604 15.9984C8.00509 15.8673 8.05567 15.7411 8.14689 15.6469L13.3119 10.4999L8.14689 5.35389C8.05303 5.26026 8.00019 5.13318 8 5.0006C7.99981 4.86802 8.05229 4.74079 8.14589 4.64689Z"
                  fill="currentColor"
                />
                <path
                  d="M8.14589 4.64689C8.23953 4.55303 8.3666 4.50019 8.49919 4.5C8.63177 4.49981 8.759 4.55229 8.85289 4.64589L14.3369 10.1109C14.3881 10.162 14.4288 10.2227 14.4566 10.2895C14.4843 10.3564 14.4986 10.428 14.4986 10.5004C14.4986 10.5728 14.4843 10.6444 14.4566 10.7113C14.4288 10.7781 14.3881 10.8388 14.3369 10.8899L8.85289 16.3549C8.75847 16.4458 8.63209 16.4961 8.50099 16.4948C8.36989 16.4934 8.24455 16.4407 8.15197 16.3478C8.0594 16.255 8.00699 16.1295 8.00604 15.9984C8.00509 15.8673 8.05567 15.7411 8.14689 15.6469L13.3119 10.4999L8.14689 5.35389C8.05303 5.26026 8.00019 5.13318 8 5.0006C7.99981 4.86802 8.05229 4.74079 8.14589 4.64689Z"
                  fill="currentColor"
                />
                <path
                  d="M8.14589 4.64689C8.23953 4.55303 8.3666 4.50019 8.49919 4.5C8.63177 4.49981 8.759 4.55229 8.85289 4.64589L14.3369 10.1109C14.3881 10.162 14.4288 10.2227 14.4566 10.2895C14.4843 10.3564 14.4986 10.428 14.4986 10.5004C14.4986 10.5728 14.4843 10.6444 14.4566 10.7113C14.4288 10.7781 14.3881 10.8388 14.3369 10.8899L8.85289 16.3549C8.75847 16.4458 8.63209 16.4961 8.50099 16.4948C8.36989 16.4934 8.24455 16.4407 8.15197 16.3478C8.0594 16.255 8.00699 16.1295 8.00604 15.9984C8.00509 15.8673 8.05567 15.7411 8.14689 15.6469L13.3119 10.4999L8.14689 5.35389C8.05303 5.26026 8.00019 5.13318 8 5.0006C7.99981 4.86802 8.05229 4.74079 8.14589 4.64689Z"
                  fill="currentColor"
                />
                <path
                  d="M8.14589 4.64689C8.23953 4.55303 8.3666 4.50019 8.49919 4.5C8.63177 4.49981 8.759 4.55229 8.85289 4.64589L14.3369 10.1109C14.3881 10.162 14.4288 10.2227 14.4566 10.2895C14.4843 10.3564 14.4986 10.428 14.4986 10.5004C14.4986 10.5728 14.4843 10.6444 14.4566 10.7113C14.4288 10.7781 14.3881 10.8388 14.3369 10.8899L8.85289 16.3549C8.75847 16.4458 8.63209 16.4961 8.50099 16.4948C8.36989 16.4934 8.24455 16.4407 8.15197 16.3478C8.0594 16.255 8.00699 16.1295 8.00604 15.9984C8.00509 15.8673 8.05567 15.7411 8.14689 15.6469L13.3119 10.4999L8.14689 5.35389C8.05303 5.26026 8.00019 5.13318 8 5.0006C7.99981 4.86802 8.05229 4.74079 8.14589 4.64689Z"
                  fill="currentColor"
                />
              </svg>
            }
          >
            일기 작성하러가기
          </Button>
        </div>
      </div>
      <ShareButtons emotion={resultDetails.emotion} />
    </div>
  );
};

export default TestResult;
