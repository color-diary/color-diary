import { DiaryList } from './diary.type';

export interface CalendarSetProps {
  isCards: boolean;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  handleInputChangeDate?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  diaryList?: DiaryList | null;
}
