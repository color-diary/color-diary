'use client';

import questions, { TOTAL_QUESTION } from '@/data/questions';
import results from '@/data/results';
import { Emotion, EmotionCount, ResultType, Sentiment, TestHistory } from '@/types/test.type';
import { initializeEmotionCount } from '@/utils/initialEmotionCount';
import { splitCommentWithSlash } from '@/utils/splitCommentWithSlash';
import zustandStore from '@/zustand/zustandStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../common/Button';
import TextButton from '../common/TextButton';
import ProgressBar from './ProgressBar';
import AngleRightBlack from './assets/AngleRightBlack';
import AngleRightWhite from './assets/AngleRightWhite';
import StartCharacter from './assets/StartCharacter';

const Test = () => {
  const router = useRouter();
  const { setTestResult } = zustandStore();

  const [step, setStep] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false);
  const [answerList, setAnswerList] = useState<EmotionCount[]>(initializeEmotionCount());
  const [positiveCount, setPositiveCount] = useState<number>(0);
  const [negativeCount, setNegativeCount] = useState<number>(0);
  const [answerHistory, setAnswerHistory] = useState<TestHistory[]>([]);

  useEffect(() => {
    if (isLastQuestion) calculateResult();
  }, [isLastQuestion]);

  const calculateResult = (): void => {
    const todayEmotion: Emotion = answerList.reduce((max, current) =>
      current.count > max.count ? current : max
    ).emotion;
    const result: ResultType = results.find((result) => result.result === todayEmotion)!;

    const positive = Math.ceil((positiveCount / TOTAL_QUESTION) * 100);
    const negative = Math.floor((negativeCount / TOTAL_QUESTION) * 100);

    setTestResult({ result, positive, negative });

    router.push(`/emotion-test/result/?emotion=${todayEmotion}&positive=${positive}&negative=${negative}`);
  };

  const handleClickStartButton = (): void => setIsStarted(true);

  const handleSelectAnswer = (value: Emotion[], sentiment: Sentiment, points: Record<Emotion, number>): void => {
    const newAnswer = answerList.map((answer) =>
      value.includes(answer.emotion) ? { ...answer, count: answer.count + points[answer.emotion] } : answer
    );
    setAnswerList(newAnswer);

    if (sentiment === 'positive') {
      setPositiveCount(positiveCount + 1);
    } else if (sentiment === 'negative') {
      setNegativeCount(negativeCount + 1);
    }

    setAnswerHistory([...answerHistory, { step, value, sentiment, points }]);

    if (step === TOTAL_QUESTION - 1) {
      setIsLastQuestion(true);
    } else {
      setStep(step + 1);
    }
  };

  const handleClickPrevQuestion = (): void => {
    if (step === 0) {
      setIsStarted(false);
    } else {
      const prevAnswer = answerHistory[answerHistory.length - 1];
      const revertedAnswer = answerList.map((answer) =>
        prevAnswer.value.includes(answer.emotion)
          ? { ...answer, count: answer.count - prevAnswer.points[answer.emotion] }
          : answer
      );
      setAnswerList(revertedAnswer);

      if (prevAnswer.sentiment === 'positive') {
        setPositiveCount(positiveCount - 1);
      } else if (prevAnswer.sentiment === 'negative') {
        setNegativeCount(negativeCount - 1);
      }

      setAnswerHistory(answerHistory.slice(0, -1));

      setStep(step - 1);
    }
  };

  const handleClickBackButton = (): void => router.back();

  return (
    <div className="w-335px-row-m md:w-744px-row md:h-760px-col rounded-5xl border-4 border-border-color bg-white">
      {isStarted ? (
        <div className="py-12px-col-m md:py-0 px-16px-row-m md:px-0 md:h-760px-col flex flex-col gap-80px-col-m md:gap-72px-col justify-center items-center flex-shrink-0">
          <div className="w-full md:w-600px-row flex flex-col items-start gap-16px-col-m md:gap-16px-col">
            <div className="md:inline hidden">
              <TextButton onClick={handleClickPrevQuestion}>뒤로가기</TextButton>
            </div>
            <ProgressBar value={step + 1} max={TOTAL_QUESTION} />
          </div>
          <div className="w-full md:w-600px-row flex flex-col items-start gap-16px-col-m md:gap-16px-col">
            <h2 className="text-font-color text-16px-m md:text-24px font-medium tracking-0.32px md:tracking-0.48px">
              {questions[step].question}
            </h2>
            <ul className="w-full md:w-600px-row flex flex-col items-start md:px-24px-row md:py-24px-col gap-16px-col-m md:gap-24px-col">
              {questions[step].options.map((option, index) => (
                <li
                  key={index}
                  className="w-full flex justify-between items-center px-16px-row-m py-4px-col-m md:px-16px-row md:py-4px-col gap-8px-row-m md:gap-8px-row"
                >
                  <span
                    onClick={() => handleSelectAnswer(option.value, option.sentiment, option.points)}
                    className="w-full text-font-color text-start text-14px-m md:text-18px font-normal tracking-0.28px md:tracking-0.36px hover:text-default transition cursor-pointer"
                  >
                    {option.label}
                  </span>
                  <span className="w-5 h-5 md:w-20px-row md:h-20px-col">
                    <AngleRightBlack />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <span className="w-full md:w-600px-row flex justify-end text-font-color text-12px-m md:text-14px font-normal tracking-0.28px">
            {step + 1}/{TOTAL_QUESTION}
          </span>
        </div>
      ) : (
        <div className="flex flex-col mx-32px-row-m my-40px-col-m md:mx-72px-row md:mt-56px-col md:mb-80px-col gap-56px-col flex-shrink-0s">
          <div className="md:inline hidden">
            <TextButton onClick={handleClickBackButton}>뒤로가기</TextButton>
          </div>
          <div className="flex flex-col items-center gap-64px-col-m md:gap-64px-col">
            <div className="flex flex-col items-center gap-36px-col-m md:gap-36px-col">
              <h1 className="text-font-color text-20px-m md:text-28px font-bold tracking-tight md:tracking-0.56px">
                오늘 나는 어떤 상태일까?
              </h1>
              <div className="flex flex-col justify-center items-center gap-24px-col-m md:gap-24px-col self-stretch">
                <div className="flex items-center justify-center w-120px-row-m h-120px-row-m md:w-240px-row md:h-240px-row">
                  <StartCharacter />
                </div>
                <div className="text-font-color text-center text-16px-m md:text-20px font-normal tracking-0.32px md:tracking-tight">
                  {splitCommentWithSlash('오늘은 어떤 하루를 보냈나요?/나의 감정을 한번 알아봐요!😀').map(
                    (line, index) => (
                      <p key={index}>{line}</p>
                    )
                  )}
                </div>
              </div>
            </div>
            <Button onClick={handleClickStartButton} icon={<AngleRightWhite />}>
              나의 감정 확인하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;
