import { TestResultType } from './test.type';

export type tZustandStore = {
  color: string;
  tags: string[];
  content: string;
  img: File | string | null;
  testResult: TestResultType | null;
  isDiaryEditMode: boolean;
  setColor: (color: string) => void;
  setTags: (tags: string[]) => void;
  setContent: (content: string) => void;
  setImg: (img: File | null) => void;
  setTestResult: (result: TestResultType) => void;
  setIsDiaryEditMode: (isDiaryEditMode: boolean) => void;
};
