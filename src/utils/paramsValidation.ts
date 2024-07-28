import { Emotion } from '@/types/test.type';
import { validate as uuidValidate } from 'uuid';

export const isValidDate = (id: string) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  return datePattern.test(id);
};

export const isValidUUID = (id: string) => {
  return uuidValidate(id);
};

export const validateEmotion = (emotion: string): boolean => {
  const emotions: Emotion[] = ['joy', 'sadness', 'lethargy', 'calm', 'anxiety', 'anger', 'hope'];
  return emotions.includes(emotion as Emotion);
};
