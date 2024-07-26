'use client';

import questions, { TOTAL_QUESTION } from '@/data/questions';
import results from '@/data/results';
import { Emotion, EmotionCount, ResultType, Sentiment } from '@/types/test.type';
import { initializeEmotionCount } from '@/utils/initialEmotionCount';
import zustandStore from '@/zustand/zustandStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../common/Button';
import TextButton from '../common/TextButton';

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

  const handleClickBackButton = () => router.back();

  return (
    <div className="w-744px h-760px rounded-5xl border-4 border-border-color bg-white px-18 ">
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
        <div className="flex flex-col gap-14 pt-14">
          <TextButton onClick={handleClickBackButton}>뒤로가기</TextButton>
          <div className="flex flex-col px-140px items-center gap-16">
            <div className="flex flex-col items-center gap-9">
              <h1 className="text-font-color text-28px font-bold tracking-0.56px">오늘 나는 어떤 상태일까?</h1>
              <div className="flex flex-col justify-center items-center gap-6 self-stretch">
                <div className="h-60 flex justify-center items-center px-12 py-11 rounded-full bg-bg-color shadow-custom-inset">
                  <svg width="144" height="154" viewBox="0 0 144 154" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M74.0553 21.5757C72.3645 18.4743 68.9841 15.6862 64.6199 14.1835C55.6693 11.1016 45.2168 11.902 38.923 12.8589C36.1588 13.2791 35.051 16.3425 36.9398 18.404C41.1093 22.9548 48.5775 29.8121 58.1085 33.0938C62.4295 34.5817 66.7662 34.4828 69.9981 33.119V60.5045H77.9981V33.0701C81.2417 34.4803 85.6299 34.5993 90.002 33.0938C99.533 29.8121 107.001 22.9548 111.171 18.404C113.06 16.3425 111.952 13.2791 109.188 12.8589C102.894 11.902 92.4412 11.1016 83.4907 14.1835C79.1264 15.6862 75.7461 18.4743 74.0553 21.5757Z"
                      fill="#89E6CE"
                    />
                    <path
                      d="M74.0553 21.5757L72.2993 22.533L74.0553 25.754L75.8113 22.533L74.0553 21.5757ZM64.6199 14.1835L63.9687 16.0745L64.6199 14.1835ZM38.923 12.8589L38.6224 10.8816L38.923 12.8589ZM36.9398 18.404L38.4144 17.0529L38.4144 17.0529L36.9398 18.404ZM58.1085 33.0938L58.7597 31.2028L58.1085 33.0938ZM69.9981 33.119H71.9981V30.1043L69.2206 31.2764L69.9981 33.119ZM69.9981 60.5045H67.9981V62.5045H69.9981V60.5045ZM77.9981 60.5045V62.5045H79.9981V60.5045H77.9981ZM77.9981 33.0701L78.7956 31.2359L75.9981 30.0197V33.0701H77.9981ZM90.002 33.0938L89.3509 31.2028L90.002 33.0938ZM111.171 18.404L109.696 17.0529V17.0529L111.171 18.404ZM109.188 12.8589L109.488 10.8816L109.188 12.8589ZM83.4907 14.1835L84.1418 16.0745L83.4907 14.1835ZM75.8113 20.6183C73.8417 17.0055 70.0219 13.9283 65.271 12.2924L63.9687 16.0745C67.9464 17.4441 70.8873 19.943 72.2993 22.533L75.8113 20.6183ZM65.271 12.2924C55.8484 9.04798 44.9982 9.91227 38.6224 10.8816L39.2236 14.8361C45.4353 13.8918 55.4903 13.1551 63.9687 16.0745L65.271 12.2924ZM38.6224 10.8816C34.308 11.5375 32.4741 16.4905 35.4651 19.7551L38.4144 17.0529C37.9677 16.5653 37.9355 16.0634 38.0689 15.6918C38.2036 15.3165 38.5579 14.9373 39.2236 14.8361L38.6224 10.8816ZM35.4651 19.7551C39.7243 24.4038 47.4644 31.544 57.4574 34.9849L58.7597 31.2028C49.6906 28.0801 42.4942 21.5057 38.4144 17.0529L35.4651 19.7551ZM57.4574 34.9849C62.1622 36.6049 67.0157 36.5484 70.7757 34.9617L69.2206 31.2764C66.5168 32.4173 62.6969 32.5585 58.7597 31.2028L57.4574 34.9849ZM67.9981 33.119V60.5045H71.9981V33.119H67.9981ZM69.9981 62.5045H77.9981V58.5045H69.9981V62.5045ZM79.9981 60.5045V33.0701H75.9981V60.5045H79.9981ZM77.2007 34.9042C80.98 36.5473 85.8939 36.6236 90.6531 34.9849L89.3509 31.2028C85.3658 32.575 81.5034 32.4132 78.7956 31.2359L77.2007 34.9042ZM90.6531 34.9849C100.646 31.544 108.386 24.4038 112.645 19.7551L109.696 17.0529C105.616 21.5057 98.4199 28.0801 89.3509 31.2028L90.6531 34.9849ZM112.645 19.7551C115.636 16.4905 113.803 11.5375 109.488 10.8816L108.887 14.8361C109.553 14.9373 109.907 15.3165 110.042 15.6918C110.175 16.0634 110.143 16.5653 109.696 17.0529L112.645 19.7551ZM109.488 10.8816C103.112 9.91227 92.2621 9.04798 82.8395 12.2924L84.1418 16.0745C92.6203 13.1551 102.675 13.8918 108.887 14.8361L109.488 10.8816ZM82.8395 12.2924C78.0887 13.9283 74.2689 17.0055 72.2993 20.6183L75.8113 22.533C77.2233 19.943 80.1642 17.4441 84.1418 16.0745L82.8395 12.2924Z"
                      fill="#25B18C"
                    />
                    <path
                      d="M142 102.286C142 115.674 134.406 127.983 121.749 137.024C109.096 146.062 91.5135 151.715 72 151.715C52.4865 151.715 34.9039 146.062 22.2508 137.024C9.59383 127.983 2 115.674 2 102.286C2 88.8979 9.59383 76.5887 22.2508 67.548C34.9039 58.51 52.4865 52.8574 72 52.8574C91.5135 52.8574 109.096 58.51 121.749 67.548C134.406 76.5887 142 88.8979 142 102.286Z"
                      fill="#FCD4DC"
                      stroke="#F5768F"
                      strokeWidth="4"
                    />
                    <path
                      d="M27.8643 114.725L32.9285 105.953"
                      stroke="#F1A027"
                      strokeWidth="5.06424"
                      strokeLinecap="round"
                    />
                    <path
                      d="M35.4607 114.725L40.5249 105.953"
                      stroke="#F1A027"
                      strokeWidth="5.06424"
                      strokeLinecap="round"
                    />
                    <path
                      d="M43.0569 114.725L48.1211 105.953"
                      stroke="#F1A027"
                      strokeWidth="5.06424"
                      strokeLinecap="round"
                    />
                    <path
                      d="M96.1211 114.725L101.185 105.953"
                      stroke="#F1A027"
                      strokeWidth="5.06424"
                      strokeLinecap="round"
                    />
                    <path
                      d="M103.718 114.725L108.782 105.953"
                      stroke="#F1A027"
                      strokeWidth="5.06424"
                      strokeLinecap="round"
                    />
                    <path
                      d="M111.314 114.725L116.378 105.953"
                      stroke="#F1A027"
                      strokeWidth="5.06424"
                      strokeLinecap="round"
                    />
                    <ellipse cx="47.9766" cy="95.9922" rx="8.62503" ry="9" fill="#080808" />
                    <ellipse cx="47.9766" cy="95.9922" rx="8.62503" ry="9" fill="black" fill-opacity="0.2" />
                    <ellipse cx="47.9766" cy="95.9922" rx="8.62503" ry="9" fill="black" fill-opacity="0.2" />
                    <ellipse cx="47.9766" cy="95.9922" rx="8.62503" ry="9" fill="black" fill-opacity="0.2" />
                    <ellipse cx="47.9766" cy="95.9922" rx="8.62503" ry="9" fill="black" fill-opacity="0.2" />
                    <ellipse cx="47.9766" cy="95.9922" rx="8.62503" ry="9" fill="black" fill-opacity="0.2" />
                    <ellipse cx="47.834" cy="93.7427" rx="2.87501" ry="2.25" fill="white" />
                    <ellipse
                      opacity="0.8"
                      cx="1.29375"
                      cy="1.35"
                      rx="1.29375"
                      ry="1.35"
                      transform="matrix(1 0 0 -1 43.666 100.491)"
                      fill="#EDEDED"
                    />
                    <ellipse
                      cx="8.62503"
                      cy="9"
                      rx="8.62503"
                      ry="9"
                      transform="matrix(-1 0 0 1 109.852 86.9922)"
                      fill="#080808"
                    />
                    <ellipse
                      cx="8.62503"
                      cy="9"
                      rx="8.62503"
                      ry="9"
                      transform="matrix(-1 0 0 1 109.852 86.9922)"
                      fill="black"
                      fill-opacity="0.2"
                    />
                    <ellipse
                      cx="8.62503"
                      cy="9"
                      rx="8.62503"
                      ry="9"
                      transform="matrix(-1 0 0 1 109.852 86.9922)"
                      fill="black"
                      fill-opacity="0.2"
                    />
                    <ellipse
                      cx="8.62503"
                      cy="9"
                      rx="8.62503"
                      ry="9"
                      transform="matrix(-1 0 0 1 109.852 86.9922)"
                      fill="black"
                      fill-opacity="0.2"
                    />
                    <ellipse
                      cx="8.62503"
                      cy="9"
                      rx="8.62503"
                      ry="9"
                      transform="matrix(-1 0 0 1 109.852 86.9922)"
                      fill="black"
                      fill-opacity="0.2"
                    />
                    <ellipse
                      cx="8.62503"
                      cy="9"
                      rx="8.62503"
                      ry="9"
                      transform="matrix(-1 0 0 1 109.852 86.9922)"
                      fill="black"
                      fill-opacity="0.2"
                    />
                    <ellipse
                      cx="2.87501"
                      cy="2.25"
                      rx="2.87501"
                      ry="2.25"
                      transform="matrix(-1 0 0 1 104.244 91.4927)"
                      fill="white"
                    />
                    <ellipse
                      opacity="0.8"
                      cx="104.243"
                      cy="99.1412"
                      rx="1.29375"
                      ry="1.35"
                      transform="rotate(180 104.243 99.1412)"
                      fill="#EDEDED"
                    />
                    <circle cx="6" cy="6" r="6" transform="matrix(1 0 0 -1 66 122.857)" fill="#F78383" />
                    <path
                      d="M70 26C63.5092 25.7986 50.1311 22.116 46 18"
                      stroke="#25B18C"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M78 26.001C84.4908 25.7996 97.8689 22.117 102 18.001"
                      stroke="#25B18C"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="w-80 text-font-color text-center text-2xl font-normal tracking-0.48px">
                  오늘은 어떤 하루를 보냈나요? 나의 감정을 한번 알아봐요!😀
                </p>
              </div>
            </div>
            <Button
              size={'lg'}
              onClick={handleClickStartButton}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 24">
                  <path
                    d="M9.67532 4.97644C9.78767 4.8638 9.94017 4.8004 10.0993 4.80017C10.2584 4.79995 10.411 4.86292 10.5237 4.97524L17.1045 11.5332C17.166 11.5946 17.2148 11.6674 17.2481 11.7476C17.2814 11.8278 17.2985 11.9138 17.2985 12.0006C17.2985 12.0875 17.2814 12.1735 17.2481 12.2537C17.2148 12.3339 17.166 12.4067 17.1045 12.468L10.5237 19.026C10.4104 19.1352 10.2588 19.1955 10.1014 19.1939C9.94411 19.1923 9.7937 19.129 9.68261 19.0176C9.57152 18.9062 9.50863 18.7556 9.50749 18.5983C9.50635 18.4409 9.56705 18.2894 9.67652 18.1764L15.8745 12L9.67652 5.82484C9.56388 5.71249 9.50047 5.55999 9.50024 5.40089C9.50002 5.24179 9.56299 5.08912 9.67532 4.97644Z"
                    fill="white"
                  />
                  <path
                    d="M9.67532 4.97644C9.78767 4.8638 9.94017 4.8004 10.0993 4.80017C10.2584 4.79995 10.411 4.86292 10.5237 4.97524L17.1045 11.5332C17.166 11.5946 17.2148 11.6674 17.2481 11.7476C17.2814 11.8278 17.2985 11.9138 17.2985 12.0006C17.2985 12.0875 17.2814 12.1735 17.2481 12.2537C17.2148 12.3339 17.166 12.4067 17.1045 12.468L10.5237 19.026C10.4104 19.1352 10.2588 19.1955 10.1014 19.1939C9.94411 19.1923 9.7937 19.129 9.68261 19.0176C9.57152 18.9062 9.50863 18.7556 9.50749 18.5983C9.50635 18.4409 9.56705 18.2894 9.67652 18.1764L15.8745 12L9.67652 5.82484C9.56388 5.71249 9.50047 5.55999 9.50024 5.40089C9.50002 5.24179 9.56299 5.08912 9.67532 4.97644Z"
                    fill="white"
                  />
                  <path
                    d="M9.67532 4.97644C9.78767 4.8638 9.94017 4.8004 10.0993 4.80017C10.2584 4.79995 10.411 4.86292 10.5237 4.97524L17.1045 11.5332C17.166 11.5946 17.2148 11.6674 17.2481 11.7476C17.2814 11.8278 17.2985 11.9138 17.2985 12.0006C17.2985 12.0875 17.2814 12.1735 17.2481 12.2537C17.2148 12.3339 17.166 12.4067 17.1045 12.468L10.5237 19.026C10.4104 19.1352 10.2588 19.1955 10.1014 19.1939C9.94411 19.1923 9.7937 19.129 9.68261 19.0176C9.57152 18.9062 9.50863 18.7556 9.50749 18.5983C9.50635 18.4409 9.56705 18.2894 9.67652 18.1764L15.8745 12L9.67652 5.82484C9.56388 5.71249 9.50047 5.55999 9.50024 5.40089C9.50002 5.24179 9.56299 5.08912 9.67532 4.97644Z"
                    fill="white"
                  />
                  <path
                    d="M9.67532 4.97644C9.78767 4.8638 9.94017 4.8004 10.0993 4.80017C10.2584 4.79995 10.411 4.86292 10.5237 4.97524L17.1045 11.5332C17.166 11.5946 17.2148 11.6674 17.2481 11.7476C17.2814 11.8278 17.2985 11.9138 17.2985 12.0006C17.2985 12.0875 17.2814 12.1735 17.2481 12.2537C17.2148 12.3339 17.166 12.4067 17.1045 12.468L10.5237 19.026C10.4104 19.1352 10.2588 19.1955 10.1014 19.1939C9.94411 19.1923 9.7937 19.129 9.68261 19.0176C9.57152 18.9062 9.50863 18.7556 9.50749 18.5983C9.50635 18.4409 9.56705 18.2894 9.67652 18.1764L15.8745 12L9.67652 5.82484C9.56388 5.71249 9.50047 5.55999 9.50024 5.40089C9.50002 5.24179 9.56299 5.08912 9.67532 4.97644Z"
                    fill="white"
                  />
                  <path
                    d="M9.67532 4.97644C9.78767 4.8638 9.94017 4.8004 10.0993 4.80017C10.2584 4.79995 10.411 4.86292 10.5237 4.97524L17.1045 11.5332C17.166 11.5946 17.2148 11.6674 17.2481 11.7476C17.2814 11.8278 17.2985 11.9138 17.2985 12.0006C17.2985 12.0875 17.2814 12.1735 17.2481 12.2537C17.2148 12.3339 17.166 12.4067 17.1045 12.468L10.5237 19.026C10.4104 19.1352 10.2588 19.1955 10.1014 19.1939C9.94411 19.1923 9.7937 19.129 9.68261 19.0176C9.57152 18.9062 9.50863 18.7556 9.50749 18.5983C9.50635 18.4409 9.56705 18.2894 9.67652 18.1764L15.8745 12L9.67652 5.82484C9.56388 5.71249 9.50047 5.55999 9.50024 5.40089C9.50002 5.24179 9.56299 5.08912 9.67532 4.97644Z"
                    fill="white"
                  />
                  <path
                    d="M9.67532 4.97644C9.78767 4.8638 9.94017 4.8004 10.0993 4.80017C10.2584 4.79995 10.411 4.86292 10.5237 4.97524L17.1045 11.5332C17.166 11.5946 17.2148 11.6674 17.2481 11.7476C17.2814 11.8278 17.2985 11.9138 17.2985 12.0006C17.2985 12.0875 17.2814 12.1735 17.2481 12.2537C17.2148 12.3339 17.166 12.4067 17.1045 12.468L10.5237 19.026C10.4104 19.1352 10.2588 19.1955 10.1014 19.1939C9.94411 19.1923 9.7937 19.129 9.68261 19.0176C9.57152 18.9062 9.50863 18.7556 9.50749 18.5983C9.50635 18.4409 9.56705 18.2894 9.67652 18.1764L15.8745 12L9.67652 5.82484C9.56388 5.71249 9.50047 5.55999 9.50024 5.40089C9.50002 5.24179 9.56299 5.08912 9.67532 4.97644Z"
                    fill="white"
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
