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
    <div className="w-744px-row h-760px-col rounded-5xl border-4 border-border-color bg-white">
      {isStarted ? (
        <div className="h-760px-col flex flex-col gap-72px-col justify-center items-center flex-shrink-0">
          <div className="w-600px-row flex flex-col items-start gap-16px-col">
            <TextButton onClick={handleClickPrevQuestion}>뒤로가기</TextButton>
            <ProgressBar value={step + 1} max={TOTAL_QUESTION} />
          </div>
          <div className="w-600px-row flex flex-col items-start gap-16px-col">
            <h2 className="text-font-color text-24px font-medium tracking-0.48px">{questions[step].question}</h2>
            <ul className="w-600px-row flex flex-col items-start px-24px-row py-24px-col gap-24px-col">
              {questions[step].options.map((option, index) => (
                <li key={index} className="w-full flex justify-between items-center px-16px-row py-4px-col gap-2">
                  <button
                    onClick={() => handleSelectAnswer(option.value, option.sentiment, option.points)}
                    className="text-font-color text-20px font-normal tracking-tight active:text-default transition"
                  >
                    {option.label}
                  </button>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-20px-row h-20px-col" viewBox="0 0 20 20">
                    <path
                      d="M7.64589 4.64689C7.73953 4.55303 7.8666 4.50019 7.99919 4.5C8.13177 4.49981 8.259 4.55229 8.35289 4.64589L13.8369 10.1109C13.8881 10.162 13.9288 10.2227 13.9566 10.2895C13.9843 10.3564 13.9986 10.428 13.9986 10.5004C13.9986 10.5728 13.9843 10.6444 13.9566 10.7113C13.9288 10.7781 13.8881 10.8388 13.8369 10.8899L8.35289 16.3549C8.25847 16.4458 8.13209 16.4961 8.00099 16.4948C7.86989 16.4934 7.74455 16.4407 7.65197 16.3478C7.5594 16.255 7.50699 16.1295 7.50604 15.9984C7.50509 15.8673 7.55567 15.7411 7.64689 15.6469L12.8119 10.4999L7.64689 5.35389C7.55303 5.26026 7.50019 5.13318 7.5 5.0006C7.49981 4.86802 7.55229 4.74079 7.64589 4.64689Z"
                      fill="#080808"
                    />
                    <path
                      d="M7.64589 4.64689C7.73953 4.55303 7.8666 4.50019 7.99919 4.5C8.13177 4.49981 8.259 4.55229 8.35289 4.64589L13.8369 10.1109C13.8881 10.162 13.9288 10.2227 13.9566 10.2895C13.9843 10.3564 13.9986 10.428 13.9986 10.5004C13.9986 10.5728 13.9843 10.6444 13.9566 10.7113C13.9288 10.7781 13.8881 10.8388 13.8369 10.8899L8.35289 16.3549C8.25847 16.4458 8.13209 16.4961 8.00099 16.4948C7.86989 16.4934 7.74455 16.4407 7.65197 16.3478C7.5594 16.255 7.50699 16.1295 7.50604 15.9984C7.50509 15.8673 7.55567 15.7411 7.64689 15.6469L12.8119 10.4999L7.64689 5.35389C7.55303 5.26026 7.50019 5.13318 7.5 5.0006C7.49981 4.86802 7.55229 4.74079 7.64589 4.64689Z"
                      fill="black"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M7.64589 4.64689C7.73953 4.55303 7.8666 4.50019 7.99919 4.5C8.13177 4.49981 8.259 4.55229 8.35289 4.64589L13.8369 10.1109C13.8881 10.162 13.9288 10.2227 13.9566 10.2895C13.9843 10.3564 13.9986 10.428 13.9986 10.5004C13.9986 10.5728 13.9843 10.6444 13.9566 10.7113C13.9288 10.7781 13.8881 10.8388 13.8369 10.8899L8.35289 16.3549C8.25847 16.4458 8.13209 16.4961 8.00099 16.4948C7.86989 16.4934 7.74455 16.4407 7.65197 16.3478C7.5594 16.255 7.50699 16.1295 7.50604 15.9984C7.50509 15.8673 7.55567 15.7411 7.64689 15.6469L12.8119 10.4999L7.64689 5.35389C7.55303 5.26026 7.50019 5.13318 7.5 5.0006C7.49981 4.86802 7.55229 4.74079 7.64589 4.64689Z"
                      fill="black"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M7.64589 4.64689C7.73953 4.55303 7.8666 4.50019 7.99919 4.5C8.13177 4.49981 8.259 4.55229 8.35289 4.64589L13.8369 10.1109C13.8881 10.162 13.9288 10.2227 13.9566 10.2895C13.9843 10.3564 13.9986 10.428 13.9986 10.5004C13.9986 10.5728 13.9843 10.6444 13.9566 10.7113C13.9288 10.7781 13.8881 10.8388 13.8369 10.8899L8.35289 16.3549C8.25847 16.4458 8.13209 16.4961 8.00099 16.4948C7.86989 16.4934 7.74455 16.4407 7.65197 16.3478C7.5594 16.255 7.50699 16.1295 7.50604 15.9984C7.50509 15.8673 7.55567 15.7411 7.64689 15.6469L12.8119 10.4999L7.64689 5.35389C7.55303 5.26026 7.50019 5.13318 7.5 5.0006C7.49981 4.86802 7.55229 4.74079 7.64589 4.64689Z"
                      fill="black"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M7.64589 4.64689C7.73953 4.55303 7.8666 4.50019 7.99919 4.5C8.13177 4.49981 8.259 4.55229 8.35289 4.64589L13.8369 10.1109C13.8881 10.162 13.9288 10.2227 13.9566 10.2895C13.9843 10.3564 13.9986 10.428 13.9986 10.5004C13.9986 10.5728 13.9843 10.6444 13.9566 10.7113C13.9288 10.7781 13.8881 10.8388 13.8369 10.8899L8.35289 16.3549C8.25847 16.4458 8.13209 16.4961 8.00099 16.4948C7.86989 16.4934 7.74455 16.4407 7.65197 16.3478C7.5594 16.255 7.50699 16.1295 7.50604 15.9984C7.50509 15.8673 7.55567 15.7411 7.64689 15.6469L12.8119 10.4999L7.64689 5.35389C7.55303 5.26026 7.50019 5.13318 7.5 5.0006C7.49981 4.86802 7.55229 4.74079 7.64589 4.64689Z"
                      fill="black"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M7.64589 4.64689C7.73953 4.55303 7.8666 4.50019 7.99919 4.5C8.13177 4.49981 8.259 4.55229 8.35289 4.64589L13.8369 10.1109C13.8881 10.162 13.9288 10.2227 13.9566 10.2895C13.9843 10.3564 13.9986 10.428 13.9986 10.5004C13.9986 10.5728 13.9843 10.6444 13.9566 10.7113C13.9288 10.7781 13.8881 10.8388 13.8369 10.8899L8.35289 16.3549C8.25847 16.4458 8.13209 16.4961 8.00099 16.4948C7.86989 16.4934 7.74455 16.4407 7.65197 16.3478C7.5594 16.255 7.50699 16.1295 7.50604 15.9984C7.50509 15.8673 7.55567 15.7411 7.64689 15.6469L12.8119 10.4999L7.64689 5.35389C7.55303 5.26026 7.50019 5.13318 7.5 5.0006C7.49981 4.86802 7.55229 4.74079 7.64589 4.64689Z"
                      fill="black"
                      fillOpacity="0.2"
                    />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
          <span className="w-600px-row flex justify-end text-font-color text-16px font-normal tracking-0.32px">
            {step + 1}/{TOTAL_QUESTION}
          </span>
        </div>
      ) : (
        <div className="flex flex-col mx-72px-row mt-56px-col mb-80px-col gap-56px-col flex-shrink-0s">
          <TextButton onClick={handleClickBackButton}>뒤로가기</TextButton>
          <div className="flex flex-col items-center gap-64px-col">
            <div className="flex flex-col items-center gap-36px-col">
              <h1 className="text-font-color text-28px font-bold tracking-0.56px">오늘 나는 어떤 상태일까?</h1>
              <div className="flex flex-col justify-center items-center gap-24px-col self-stretch">
                <svg
                  width="calc(100vw * 0.125)"
                  height="calc(100vh * 0.2222)"
                  viewBox="0 0 240 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_i_2399_11867)">
                    <rect width="240" height="240" rx="120" fill="#F7F0E9" />
                    <rect x="2" y="2" width="236" height="236" rx="118" stroke="#FBF8F4" strokeWidth="4" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M121.055 64.5757C119.364 61.4743 115.984 58.6862 111.62 57.1835C102.669 54.1016 92.2168 54.902 85.923 55.8589C83.1588 56.2791 82.051 59.3425 83.9398 61.404C88.1093 65.9548 95.5775 72.8121 105.109 76.0938C109.43 77.5817 113.766 77.4828 116.998 76.119V103.504H124.998V76.0701C128.242 77.4803 132.63 77.5993 137.002 76.0938C146.533 72.8121 154.001 65.9548 158.171 61.404C160.06 59.3425 158.952 56.2791 156.188 55.8589C149.894 54.902 139.441 54.1016 130.491 57.1835C126.126 58.6862 122.746 61.4743 121.055 64.5757Z"
                      fill="#89E6CE"
                    />
                    <path
                      d="M121.055 64.5757L119.299 65.533L121.055 68.754L122.811 65.533L121.055 64.5757ZM111.62 57.1835L110.969 59.0745L111.62 57.1835ZM85.923 55.8589L85.6224 53.8816L85.923 55.8589ZM83.9398 61.404L85.4144 60.0529L85.4144 60.0529L83.9398 61.404ZM105.109 76.0938L105.76 74.2028L105.109 76.0938ZM116.998 76.119H118.998V73.1043L116.221 74.2764L116.998 76.119ZM116.998 103.504H114.998V105.504H116.998V103.504ZM124.998 103.504V105.504H126.998V103.504H124.998ZM124.998 76.0701L125.796 74.2359L122.998 73.0197V76.0701H124.998ZM137.002 76.0938L136.351 74.2028L137.002 76.0938ZM158.171 61.404L156.696 60.0529V60.0529L158.171 61.404ZM156.188 55.8589L156.488 53.8816L156.188 55.8589ZM130.491 57.1835L131.142 59.0745L130.491 57.1835ZM122.811 63.6183C120.842 60.0055 117.022 56.9283 112.271 55.2924L110.969 59.0745C114.946 60.4441 117.887 62.943 119.299 65.533L122.811 63.6183ZM112.271 55.2924C102.848 52.048 91.9982 52.9123 85.6224 53.8816L86.2236 57.8361C92.4353 56.8918 102.49 56.1551 110.969 59.0745L112.271 55.2924ZM85.6224 53.8816C81.308 54.5375 79.4741 59.4905 82.4651 62.7551L85.4144 60.0529C84.9677 59.5653 84.9355 59.0634 85.0689 58.6918C85.2036 58.3165 85.5579 57.9373 86.2236 57.8361L85.6224 53.8816ZM82.4651 62.7551C86.7243 67.4038 94.4644 74.544 104.457 77.9849L105.76 74.2028C96.6906 71.0801 89.4942 64.5057 85.4144 60.0529L82.4651 62.7551ZM104.457 77.9849C109.162 79.6049 114.016 79.5484 117.776 77.9617L116.221 74.2764C113.517 75.4173 109.697 75.5585 105.76 74.2028L104.457 77.9849ZM114.998 76.119V103.504H118.998V76.119H114.998ZM116.998 105.504H124.998V101.504H116.998V105.504ZM126.998 103.504V76.0701H122.998V103.504H126.998ZM124.201 77.9042C127.98 79.5473 132.894 79.6236 137.653 77.9849L136.351 74.2028C132.366 75.575 128.503 75.4132 125.796 74.2359L124.201 77.9042ZM137.653 77.9849C147.646 74.544 155.386 67.4038 159.645 62.7551L156.696 60.0529C152.616 64.5057 145.42 71.0801 136.351 74.2028L137.653 77.9849ZM159.645 62.7551C162.636 59.4905 160.803 54.5375 156.488 53.8816L155.887 57.8361C156.553 57.9373 156.907 58.3165 157.042 58.6918C157.175 59.0634 157.143 59.5653 156.696 60.0529L159.645 62.7551ZM156.488 53.8816C150.112 52.9123 139.262 52.048 129.84 55.2924L131.142 59.0745C139.62 56.1551 149.675 56.8918 155.887 57.8361L156.488 53.8816ZM129.84 55.2924C125.089 56.9283 121.269 60.0055 119.299 63.6183L122.811 65.533C124.223 62.943 127.164 60.4441 131.142 59.0745L129.84 55.2924Z"
                      fill="#25B18C"
                    />
                    <path
                      d="M189 145.286C189 158.674 181.406 170.983 168.749 180.024C156.096 189.062 138.513 194.715 119 194.715C99.4865 194.715 81.9039 189.062 69.2508 180.024C56.5938 170.983 49 158.674 49 145.286C49 131.898 56.5938 119.589 69.2508 110.548C81.9039 101.51 99.4865 95.8574 119 95.8574C138.513 95.8574 156.096 101.51 168.749 110.548C181.406 119.589 189 131.898 189 145.286Z"
                      fill="#FCD4DC"
                      stroke="#F5768F"
                      strokeWidth="4"
                    />
                    <path
                      d="M74.8643 157.725L79.9285 148.953"
                      stroke="#F1A027"
                      strokeWidth="5.06424"
                      strokeLinecap="round"
                    />
                    <path
                      d="M82.4607 157.725L87.5249 148.953"
                      stroke="#F1A027"
                      strokeWidth="5.06424"
                      strokeLinecap="round"
                    />
                    <path
                      d="M90.0569 157.725L95.1211 148.953"
                      stroke="#F1A027"
                      strokeWidth="5.06424"
                      strokeLinecap="round"
                    />
                    <path
                      d="M143.121 157.725L148.185 148.953"
                      stroke="#F1A027"
                      strokeWidth="5.06424"
                      strokeLinecap="round"
                    />
                    <path
                      d="M150.718 157.725L155.782 148.953"
                      stroke="#F1A027"
                      strokeWidth="5.06424"
                      strokeLinecap="round"
                    />
                    <path
                      d="M158.314 157.725L163.378 148.953"
                      stroke="#F1A027"
                      strokeWidth="5.06424"
                      strokeLinecap="round"
                    />
                    <ellipse cx="94.9766" cy="138.992" rx="8.62503" ry="9" fill="#080808" />
                    <ellipse cx="94.9766" cy="138.992" rx="8.62503" ry="9" fill="black" fillOpacity="0.2" />
                    <ellipse cx="94.9766" cy="138.992" rx="8.62503" ry="9" fill="black" fillOpacity="0.2" />
                    <ellipse cx="94.9766" cy="138.992" rx="8.62503" ry="9" fill="black" fillOpacity="0.2" />
                    <ellipse cx="94.9766" cy="138.992" rx="8.62503" ry="9" fill="black" fillOpacity="0.2" />
                    <ellipse cx="94.9766" cy="138.992" rx="8.62503" ry="9" fill="black" fillOpacity="0.2" />
                    <ellipse cx="94.834" cy="136.743" rx="2.87501" ry="2.25" fill="white" />
                    <ellipse
                      opacity="0.8"
                      cx="1.29375"
                      cy="1.35"
                      rx="1.29375"
                      ry="1.35"
                      transform="matrix(1 0 0 -1 90.666 143.491)"
                      fill="#EDEDED"
                    />
                    <ellipse
                      cx="8.62503"
                      cy="9"
                      rx="8.62503"
                      ry="9"
                      transform="matrix(-1 0 0 1 156.852 129.992)"
                      fill="#080808"
                    />
                    <ellipse
                      cx="8.62503"
                      cy="9"
                      rx="8.62503"
                      ry="9"
                      transform="matrix(-1 0 0 1 156.852 129.992)"
                      fill="black"
                      fillOpacity="0.2"
                    />
                    <ellipse
                      cx="8.62503"
                      cy="9"
                      rx="8.62503"
                      ry="9"
                      transform="matrix(-1 0 0 1 156.852 129.992)"
                      fill="black"
                      fillOpacity="0.2"
                    />
                    <ellipse
                      cx="8.62503"
                      cy="9"
                      rx="8.62503"
                      ry="9"
                      transform="matrix(-1 0 0 1 156.852 129.992)"
                      fill="black"
                      fillOpacity="0.2"
                    />
                    <ellipse
                      cx="8.62503"
                      cy="9"
                      rx="8.62503"
                      ry="9"
                      transform="matrix(-1 0 0 1 156.852 129.992)"
                      fill="black"
                      fillOpacity="0.2"
                    />
                    <ellipse
                      cx="8.62503"
                      cy="9"
                      rx="8.62503"
                      ry="9"
                      transform="matrix(-1 0 0 1 156.852 129.992)"
                      fill="black"
                      fillOpacity="0.2"
                    />
                    <ellipse
                      cx="2.87501"
                      cy="2.25"
                      rx="2.87501"
                      ry="2.25"
                      transform="matrix(-1 0 0 1 151.244 134.493)"
                      fill="white"
                    />
                    <ellipse
                      opacity="0.8"
                      cx="151.243"
                      cy="142.141"
                      rx="1.29375"
                      ry="1.35"
                      transform="rotate(180 151.243 142.141)"
                      fill="#EDEDED"
                    />
                    <circle cx="6" cy="6" r="6" transform="matrix(1 0 0 -1 113 165.857)" fill="#F78383" />
                    <path
                      d="M117 69C110.509 68.7986 97.1311 65.116 93 61"
                      stroke="#25B18C"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M125 69.001C131.491 68.7996 144.869 65.117 149 61.001"
                      stroke="#25B18C"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_i_2399_11867"
                      x="0"
                      y="0"
                      width="240"
                      height="240"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dx="8" dy="8" />
                      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.901961 0 0 0 0 0.827451 0 0 0 0 0.737255 0 0 0 1 0"
                      />
                      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_2399_11867" />
                    </filter>
                  </defs>
                </svg>
                <div className="text-font-color text-center text-24px font-normal tracking-0.48px">
                  {splitCommentWithSlash('오늘은 어떤 하루를 보냈나요?/나의 감정을 한번 알아봐요!😀').map(
                    (line, index) => (
                      <p key={index}>{line}</p>
                    )
                  )}
                </div>
              </div>
            </div>
            <Button
              size={'lg'}
              onClick={handleClickStartButton}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 24">
                  <path
                    d="M9.67532 4.97644C9.78767 4.8638 9.94017 4.8004 10.0993 4.80017C10.2584 4.79995 10.411 4.86292 10.5237 4.97524L17.1045 11.5332C17.166 11.5946 17.2148 11.6674 17.2481 11.7476C17.2814 11.8278 17.2985 11.9138 17.2985 12.0006C17.2985 12.0875 17.2814 12.1735 17.2481 12.2537C17.2148 12.3339 17.166 12.4067 17.1045 12.468L10.5237 19.026C10.4104 19.1352 10.2588 19.1955 10.1014 19.1939C9.94411 19.1923 9.7937 19.129 9.68261 19.0176C9.57152 18.9062 9.50863 18.7556 9.50749 18.5983C9.50635 18.4409 9.56705 18.2894 9.67652 18.1764L15.8745 12L9.67652 5.82484C9.56388 5.71249 9.50047 5.55999 9.50024 5.40089C9.50002 5.24179 9.56299 5.08912 9.67532 4.97644Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9.67532 4.97644C9.78767 4.8638 9.94017 4.8004 10.0993 4.80017C10.2584 4.79995 10.411 4.86292 10.5237 4.97524L17.1045 11.5332C17.166 11.5946 17.2148 11.6674 17.2481 11.7476C17.2814 11.8278 17.2985 11.9138 17.2985 12.0006C17.2985 12.0875 17.2814 12.1735 17.2481 12.2537C17.2148 12.3339 17.166 12.4067 17.1045 12.468L10.5237 19.026C10.4104 19.1352 10.2588 19.1955 10.1014 19.1939C9.94411 19.1923 9.7937 19.129 9.68261 19.0176C9.57152 18.9062 9.50863 18.7556 9.50749 18.5983C9.50635 18.4409 9.56705 18.2894 9.67652 18.1764L15.8745 12L9.67652 5.82484C9.56388 5.71249 9.50047 5.55999 9.50024 5.40089C9.50002 5.24179 9.56299 5.08912 9.67532 4.97644Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9.67532 4.97644C9.78767 4.8638 9.94017 4.8004 10.0993 4.80017C10.2584 4.79995 10.411 4.86292 10.5237 4.97524L17.1045 11.5332C17.166 11.5946 17.2148 11.6674 17.2481 11.7476C17.2814 11.8278 17.2985 11.9138 17.2985 12.0006C17.2985 12.0875 17.2814 12.1735 17.2481 12.2537C17.2148 12.3339 17.166 12.4067 17.1045 12.468L10.5237 19.026C10.4104 19.1352 10.2588 19.1955 10.1014 19.1939C9.94411 19.1923 9.7937 19.129 9.68261 19.0176C9.57152 18.9062 9.50863 18.7556 9.50749 18.5983C9.50635 18.4409 9.56705 18.2894 9.67652 18.1764L15.8745 12L9.67652 5.82484C9.56388 5.71249 9.50047 5.55999 9.50024 5.40089C9.50002 5.24179 9.56299 5.08912 9.67532 4.97644Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9.67532 4.97644C9.78767 4.8638 9.94017 4.8004 10.0993 4.80017C10.2584 4.79995 10.411 4.86292 10.5237 4.97524L17.1045 11.5332C17.166 11.5946 17.2148 11.6674 17.2481 11.7476C17.2814 11.8278 17.2985 11.9138 17.2985 12.0006C17.2985 12.0875 17.2814 12.1735 17.2481 12.2537C17.2148 12.3339 17.166 12.4067 17.1045 12.468L10.5237 19.026C10.4104 19.1352 10.2588 19.1955 10.1014 19.1939C9.94411 19.1923 9.7937 19.129 9.68261 19.0176C9.57152 18.9062 9.50863 18.7556 9.50749 18.5983C9.50635 18.4409 9.56705 18.2894 9.67652 18.1764L15.8745 12L9.67652 5.82484C9.56388 5.71249 9.50047 5.55999 9.50024 5.40089C9.50002 5.24179 9.56299 5.08912 9.67532 4.97644Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9.67532 4.97644C9.78767 4.8638 9.94017 4.8004 10.0993 4.80017C10.2584 4.79995 10.411 4.86292 10.5237 4.97524L17.1045 11.5332C17.166 11.5946 17.2148 11.6674 17.2481 11.7476C17.2814 11.8278 17.2985 11.9138 17.2985 12.0006C17.2985 12.0875 17.2814 12.1735 17.2481 12.2537C17.2148 12.3339 17.166 12.4067 17.1045 12.468L10.5237 19.026C10.4104 19.1352 10.2588 19.1955 10.1014 19.1939C9.94411 19.1923 9.7937 19.129 9.68261 19.0176C9.57152 18.9062 9.50863 18.7556 9.50749 18.5983C9.50635 18.4409 9.56705 18.2894 9.67652 18.1764L15.8745 12L9.67652 5.82484C9.56388 5.71249 9.50047 5.55999 9.50024 5.40089C9.50002 5.24179 9.56299 5.08912 9.67532 4.97644Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9.67532 4.97644C9.78767 4.8638 9.94017 4.8004 10.0993 4.80017C10.2584 4.79995 10.411 4.86292 10.5237 4.97524L17.1045 11.5332C17.166 11.5946 17.2148 11.6674 17.2481 11.7476C17.2814 11.8278 17.2985 11.9138 17.2985 12.0006C17.2985 12.0875 17.2814 12.1735 17.2481 12.2537C17.2148 12.3339 17.166 12.4067 17.1045 12.468L10.5237 19.026C10.4104 19.1352 10.2588 19.1955 10.1014 19.1939C9.94411 19.1923 9.7937 19.129 9.68261 19.0176C9.57152 18.9062 9.50863 18.7556 9.50749 18.5983C9.50635 18.4409 9.56705 18.2894 9.67652 18.1764L15.8745 12L9.67652 5.82484C9.56388 5.71249 9.50047 5.55999 9.50024 5.40089C9.50002 5.24179 9.56299 5.08912 9.67532 4.97644Z"
                    fill="currentColor"
                  />
                </svg>
              }
            >
              나의 감정 확인하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Test;
