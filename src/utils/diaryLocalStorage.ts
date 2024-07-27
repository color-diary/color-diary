import { Diary } from '@/types/diary.type';
import { v4 as uuidv4 } from 'uuid';
import { convertFileToBase64 } from './imageFileUtils';

export const saveToLocal = async (
  color: string,
  tags: string[],
  content: string,
  img: File | string | null,
  date: string
) => {
  const diaryId = uuidv4();
  let base64Img = null;

  if (img instanceof File) {
    base64Img = await convertFileToBase64(img);
  } else {
    base64Img = img;
  }

  const diaryData = {
    diaryId,
    color,
    tags,
    content,
    img: base64Img,
    date
  };
  const savedDiaries = JSON.parse(localStorage.getItem('localDiaries') || '[]');

  if (savedDiaries.length >= 2) {
    return;
  }

  const diaryExistsForDate = savedDiaries.some((diary: { date: string }) => diary.date === date);
  if (diaryExistsForDate) {
    return;
  }

  savedDiaries.push(diaryData);
  localStorage.setItem('localDiaries', JSON.stringify(savedDiaries));
};

export const isLocalDiaryOverTwo = (): boolean => {
  const savedDiaries = JSON.parse(localStorage.getItem('localDiaries') || '[]');
  if (savedDiaries.length >= 2) {
    return true;
  }
  return false;
};
export const checkLocalDiaryExistsForDate = (date: string): boolean => {
  const savedDiaries = JSON.parse(localStorage.getItem('localDiaries') || '[]');
  const diaryExistsForDate = savedDiaries.some((diary: { date: string }) => diary.date === date);
  if (diaryExistsForDate) {
    return true;
  }
  return false;
};

export const deleteFromLocal = (diaryId: string) => {
  const savedDiaries = JSON.parse(localStorage.getItem('localDiaries') || '[]') as Diary[];
  const updatedDiaries = savedDiaries.filter((diary) => diary.diaryId !== diaryId);
  localStorage.setItem('localDiaries', JSON.stringify(updatedDiaries));
};

export const updateLocalDiary = (
  diaryId: string,
  color: string,
  tags: string[],
  content: string,
  img: File | string | null,
  date: string
) => {
  const savedDiaries = JSON.parse(localStorage.getItem('localDiaries') || '[]') as Diary[];
  const updatedDiaries = savedDiaries.map((diary) =>
    diary.diaryId === diaryId ? { ...diary, color, tags, content, img, date } : diary
  );
  localStorage.setItem('localDiaries', JSON.stringify(updatedDiaries));
};

export const fetchLocalDiary = (diaryId: string): Diary | undefined => {
  const savedDiaries = JSON.parse(localStorage.getItem('localDiaries') || '[]') as Diary[];
  return savedDiaries.find((diary) => diary.diaryId === diaryId);
};

export const fetchLocalDiaries = (): Diary[] => {
  const savedDiaries = JSON.parse(localStorage.getItem('localDiaries') || '[]') as Diary[];

  return savedDiaries;
};

export const clearLocalDiaries = (): void => {
  localStorage.removeItem('localDiaries');
};
