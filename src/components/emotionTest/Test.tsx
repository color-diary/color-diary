'use client';

import questions, { TOTAL_QUESTION } from '@/data/questions';
import results from '@/data/results';
import { Emotion, EmotionCount, ResultType, Sentiment } from '@/types/test.type';
import { initializeEmotionCount } from '@/utils/initialEmotionCount';
import zustandStore from '@/zustand/zustandStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../common/Button';

const Test = () => {
  const router = useRouter();
  const { setTestResult } = zustandStore();

  const [step, setStep] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false);
  const [answerList, setAnswerList] = useState<EmotionCount[]>(initializeEmotionCount());
  const [positiveCount, setPositiveCount] = useState<number>(0);
  const [negativeCount, setNegativeCount] = useState<number>(0);

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

    if (step === TOTAL_QUESTION - 1) {
      setIsLastQuestion(true);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="flex flex-col justify-center rounded-5xl border-4 border-border-color bg-white ">
      <div>
        {isStarted ? (
          <div>
            <h2>{questions[step].question}</h2>

            {questions[step].options.map((option, index) => (
              <div key={index}>
                <button onClick={() => handleSelectAnswer(option.value, option.sentiment, option.points)}>
                  {option.label}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h1>오늘 나는 어떤 상태일까?</h1>
            <Button onClick={handleClickStartButton}>내 감정 확인하기</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
