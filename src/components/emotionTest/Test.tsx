'use client';

import questions, { TOTAL_QUESTION } from '@/data/questions';
import results from '@/data/results';
import { Emotion, EmotionCount, ResultType, Sentiment } from '@/types/test.type';
import { initializeEmotionCount } from '@/utils/initialEmotionCount';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Test = () => {
  const router = useRouter();

  const [step, setStep] = useState<number>(0);
  const [result, setResult] = useState<ResultType | null>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [answerList, setAnswerList] = useState<EmotionCount[]>(initializeEmotionCount());
  const [positiveCount, setPositiveCount] = useState<number>(0);
  const [negativeCount, setNegativeCount] = useState<number>(0);

  const calculateResult = (): void => {
    const todayEmotion: Emotion = answerList.reduce((max, current) =>
      current.count > max.count ? current : max
    ).emotion;
    const resultDetails: ResultType = results.find((result) => result.result === todayEmotion)!;

    setResult(resultDetails);
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
      calculateResult();
    } else {
      setStep(step + 1);
    }
  };

  const handleClickRestartButton = (): void => {
    setStep(0);
    setResult(null);
    setIsStarted(false);
    setAnswerList(initializeEmotionCount());
    setPositiveCount(0);
    setNegativeCount(0);
  };

  const handleClickWriteDiaryButton = (): void => {
    const date = new Date();
    const formattedDate = `${String(date.getFullYear()).slice(-2)}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')}`;

    router.push(`/diaries/write/${formattedDate}`);
  };

  return (
    <div>
      {result ? (
        <div>
          <div>
            <h1>{result.emotion}</h1>
            <p>{result.comment}</p>
          </div>
          <div>
            <p>{Math.ceil((positiveCount / TOTAL_QUESTION) * 100)}</p>
            <p>{Math.floor((negativeCount / TOTAL_QUESTION) * 100)}</p>
          </div>
          <div>
            <button onClick={handleClickRestartButton}>다시 테스트하기</button>
            <button onClick={handleClickWriteDiaryButton}>일기 작성하러 가기</button>
          </div>
        </div>
      ) : (
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
              <button onClick={handleClickStartButton}>내 감정 확인하기</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Test;
