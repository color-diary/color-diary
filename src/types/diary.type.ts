export type DiaryList = Diary[];

export type Diary = {
  diaryId: string;
  userId: string;
  color: string;
  tags: string[];
  content: string;
  img: string | null;
  date: Date;
};

export type NewDiary = {
  userId: string | null;
  color: string;
  tags: string[];
  content: string;
  img: File | string | null;
  date: string;
};
