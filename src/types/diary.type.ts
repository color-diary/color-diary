export type Diary = {
  diaryId: string;
  userId: string;
  color: string;
  tags: string[];
  content: string;
  img: string | null;
  date: Date;
};
