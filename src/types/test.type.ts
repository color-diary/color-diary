export type Emotion = 'joy' | 'sadness' | 'lethargy' | 'calm' | 'anxiety' | 'anger' | 'hope';

export type Sentiment = 'positive' | 'negative';

export type QuestionType = {
  question: string;
  options: {
    label: string;
    value: Emotion[];
    sentiment: Sentiment;
    points: Record<Emotion, number>;
  }[];
};

export type ResultType = {
  result: Emotion;
  emotion: string;
  color: string;
  comment: string;
};

export type EmotionCount = {
  emotion: Emotion;
  count: number;
};

export type TestHistory = {
  step: number;
  value: Emotion[];
  sentiment: Sentiment;
  points: Record<Emotion, number>;
};

export type TestResultType = {
  result: ResultType;
  positive: number;
  negative: number;
};

export interface TestResultProps {
  emotion: Emotion;
  positive: number;
  negative: number;
}
