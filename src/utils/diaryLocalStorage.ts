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
    alert('비회원은 최대 2개의 다이어리만 작성할 수 있습니다.');
    return;
  }

  const diaryExistsForDate = savedDiaries.some((diary: { date: string }) => diary.date === date);
  if (diaryExistsForDate) {
    alert('오늘 일기를 이미 작성 하셨습니다.');
    return;
  }

  savedDiaries.push(diaryData);
  localStorage.setItem('localDiaries', JSON.stringify(savedDiaries));
};

// 비회원 다이어리 최대 개수 체크 함수
export const checkDiaryLimit = (): boolean => {
  const savedDiaries = JSON.parse(localStorage.getItem('localDiaries') || '[]');
  if (savedDiaries.length >= 2) {
    alert('비회원은 최대 2개의 다이어리만 작성할 수 있습니다.');
    return true;
  }
  return false;
};

// 특정 날짜에 이미 다이어리가 있는지 체크 함수
export const checkDiaryExistsForDate = (date: string): boolean => {
  const savedDiaries = JSON.parse(localStorage.getItem('localDiaries') || '[]');
  const diaryExistsForDate = savedDiaries.some((diary: { date: string }) => diary.date === date);
  if (diaryExistsForDate) {
    alert('오늘 일기를 이미 작성 하셨습니다.');
    return true;
  }
  return false;
};

export const deleteFromLocal = (diaryId: string) => {
  const savedDiaries = JSON.parse(localStorage.getItem('localDiaries') || '[]') as Diary[];
  const updatedDiaries = savedDiaries.filter((diary) => diary.diaryId !== diaryId);
  localStorage.setItem('localDiaries', JSON.stringify(updatedDiaries));
  alert('Diary deleted successfully');
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
  alert('Diary updated successfully');
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