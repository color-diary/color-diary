import { QuestionType } from '@/types/test.type';

const questions: QuestionType[] = [
  {
    question: '1. 오늘 아침 일어나서 하늘을 볼 때 드는 기분은 어땠나요?',
    options: [
      {
        label: 'A. 아자! 오늘은 어떤 행복한 하루가 될까? 기대된다.',
        value: ['hope', 'joy'],
        sentiment: 'positive',
        points: { hope: 1, joy: 0.9, sadness: 0, lethargy: 0, calm: 0, anxiety: 0, anger: 0 }
      },
      {
        label: 'B. 하... 또 쳇바퀴같은 하루가 시작됐구나.',
        value: ['lethargy', 'sadness'],
        sentiment: 'negative',
        points: { hope: 0, joy: 0, sadness: 0.8, lethargy: 1, calm: 0, anxiety: 0, anger: 0 }
      },
      {
        label: 'C. 별 생각이 없다.',
        value: ['calm', 'lethargy'],
        sentiment: 'positive',
        points: { hope: 0, joy: 0, sadness: 0, lethargy: 0.2, calm: 1, anxiety: 0, anger: 0 }
      },
      {
        label: 'D. 제발 오늘은 일이 생각대로 되면 좋겠다.',
        value: ['anxiety', 'anger'],
        sentiment: 'negative',
        points: { hope: 0, joy: 0, sadness: 0, lethargy: 0, calm: 0, anxiety: 1, anger: 0.9 }
      }
    ]
  },
  {
    question: '2. 오늘 하루를 어떻게 평가하나요?',
    options: [
      {
        label: 'A. 그냥 평범한 하루다.',
        value: ['calm', 'joy', 'lethargy'],
        sentiment: 'positive',
        points: { hope: 0, joy: 0.2, sadness: 0, lethargy: 0.2, calm: 1, anxiety: 0, anger: 0 }
      },
      {
        label: 'B. 더 잘 할 수 있었다는 아쉬움이 남는 하루다.',
        value: ['sadness', 'anger'],
        sentiment: 'negative',
        points: { hope: 0, joy: 0, sadness: 0.7, lethargy: 0, calm: 0, anxiety: 0, anger: 1 }
      },
      {
        label: 'C. 오늘 재미있는 일이 가득했다.',
        value: ['joy', 'hope'],
        sentiment: 'positive',
        points: { hope: 0.8, joy: 1, sadness: 0, lethargy: 0, calm: 0, anxiety: 0, anger: 0 }
      },
      {
        label: 'D. 오늘도 안전하게 하루가 지나서 다행이다.',
        value: ['anxiety', 'calm', 'anger'],
        sentiment: 'negative',
        points: { hope: 0, joy: 0, sadness: 0, lethargy: 0, calm: 0.5, anxiety: 1, anger: 0.7 }
      }
    ]
  },
  {
    question: '3. 오늘 밥을 먹을 때 어떠셨나요?',
    options: [
      {
        label: 'A. 그저 그랬다.',
        value: ['calm', 'sadness'],
        sentiment: 'positive',
        points: { hope: 0, joy: 0, sadness: 0.3, lethargy: 0, calm: 1, anxiety: 0, anger: 0 }
      },
      {
        label: 'B. 밥을 먹지 못했다.',
        value: ['sadness', 'lethargy', 'anger'],
        sentiment: 'negative',
        points: { hope: 0, joy: 0, sadness: 0.9, lethargy: 1, calm: 0, anxiety: 0, anger: 0.9 }
      },
      {
        label: 'C. 만족스러웠다.',
        value: ['joy', 'calm'],
        sentiment: 'positive',
        points: { hope: 0, joy: 1, sadness: 0, lethargy: 0, calm: 0.5, anxiety: 0, anger: 0 }
      },
      {
        label: 'D. 불편했다.',
        value: ['anxiety', 'anger'],
        sentiment: 'negative',
        points: { hope: 0, joy: 0, sadness: 0, lethargy: 0, calm: 0, anxiety: 1, anger: 0.8 }
      }
    ]
  },
  {
    question: '4. 어떤 음악이 오늘의 무드에 잘 어울릴까요?',
    options: [
      {
        label: 'A. 평소에 듣는 음악',
        value: ['calm', 'joy', 'lethargy'],
        sentiment: 'positive',
        points: { hope: 0, joy: 0.7, sadness: 0, lethargy: 0.2, calm: 1, anxiety: 0, anger: 0 }
      },
      {
        label: 'B. 기분이 좋아지는 음악',
        value: ['sadness', 'lethargy', 'anxiety', 'anger'],
        sentiment: 'positive',
        points: { hope: 0, joy: 0.5, sadness: 1, lethargy: 0.8, calm: 0, anxiety: 0.9, anger: 1 }
      },
      {
        label: 'C. 기분이 차분해지는 음악',
        value: ['anger', 'anxiety'],
        sentiment: 'negative',
        points: { hope: 0, joy: 0, sadness: 0, lethargy: 0, calm: 0.8, anxiety: 1, anger: 0.9 }
      },
      {
        label: 'D. 힘이 나는 음악',
        value: ['hope', 'lethargy'],
        sentiment: 'positive',
        points: { hope: 1, joy: 0, sadness: 0, lethargy: 0.5, calm: 0, anxiety: 0, anger: 0 }
      }
    ]
  },
  {
    question: '5. 오늘 나의 차림은 어떻게 느껴졌나요?',
    options: [
      {
        label: 'A. 오, 오늘 좀 멋진데?',
        value: ['joy', 'hope'],
        sentiment: 'positive',
        points: { hope: 0.9, joy: 1, sadness: 0, lethargy: 0, calm: 0, anxiety: 0, anger: 0 }
      },
      {
        label: 'B. 아.. 이러고 나가야 한다고? 싫다..',
        value: ['anger', 'sadness', 'anxiety'],
        sentiment: 'negative',
        points: { hope: 0, joy: 0, sadness: 0.9, lethargy: 0, calm: 0, anxiety: 0.6, anger: 1 }
      },
      {
        label: 'C. 별 생각 없다.',
        value: ['calm', 'lethargy'],
        sentiment: 'positive',
        points: { hope: 0, joy: 0, sadness: 0, lethargy: 0.5, calm: 1, anxiety: 0, anger: 0 }
      },
      {
        label: 'D. 내 차림 괜찮은가? 안 이상해 보일까?',
        value: ['anxiety'],
        sentiment: 'negative',
        points: { hope: 0, joy: 0, sadness: 0, lethargy: 0, calm: 0, anxiety: 1, anger: 0 }
      }
    ]
  },
  {
    question: '6. 하루 중 가장 만족스러웠던 순간은 언제였나요?',
    options: [
      {
        label: 'A. 아침',
        value: ['sadness', 'anger', 'anxiety'],
        sentiment: 'negative',
        points: { hope: 0, joy: 0, sadness: 1, lethargy: 0, calm: 0, anxiety: 0.7, anger: 0.6 }
      },
      {
        label: 'B. 점심',
        value: ['calm'],
        sentiment: 'positive',
        points: { hope: 0, joy: 0, sadness: 0, lethargy: 0, calm: 1, anxiety: 0, anger: 0 }
      },
      {
        label: 'C. 저녁',
        value: ['joy'],
        sentiment: 'positive',
        points: { hope: 0, joy: 1, sadness: 0, lethargy: 0, calm: 0, anxiety: 0, anger: 0 }
      },
      {
        label: 'D. 지금',
        value: ['lethargy', 'hope'],
        sentiment: 'positive',
        points: { hope: 0.9, joy: 0, sadness: 0, lethargy: 1, calm: 0, anxiety: 0, anger: 0 }
      }
    ]
  }
];

export const TOTAL_QUESTION = questions.length;

export default questions;
