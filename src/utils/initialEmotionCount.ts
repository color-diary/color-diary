import { Emotion, EmotionCount } from '@/types/test.type';

export const initializeEmotionCount = (): EmotionCount[] => {
  const emotions: Emotion[] = ['joy', 'sadness', 'lethargy', 'calm', 'anxiety', 'anger', 'hope'];
  return emotions.map((emotion) => ({ emotion, count: 0 }));
};
