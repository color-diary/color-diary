import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

export const saveToLocal = (
  color: string,
  tags: string[],
  content: string,
  img: File | string | null,
  date: string
) => {
  const localDiaryId = uuidv4();
  const diaryData = {
    localDiaryId,
    color,
    tags,
    content,
    img,
    date
  };
  const savedDiaries = JSON.parse(localStorage.getItem('localDiaries') || '[]');

  const router = useRouter();
  if (savedDiaries.length >= 2) {
    alert('비회원은 최대 2개의 다이어리만 작성할 수 있습니다.');
    router.replace('/');
    return;
  }

  const diaryExistsForDate = savedDiaries.some((diary: { date: string }) => diary.date === date);
  if (diaryExistsForDate) {
    alert('오늘 일기를 이미 작성 하셨습니다.');
    router.replace('/');
    return;
  }

  savedDiaries.push(diaryData);
  localStorage.setItem('localDiaries', JSON.stringify(savedDiaries));
  router.replace('/');
  alert('비회원 글작성 완료');
};
