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
