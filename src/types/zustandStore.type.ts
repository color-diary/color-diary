import { TestResultType } from './test.type';

export type tZustandStore = {
  color: string;
  tags: string[];
  content: string;
  img: File | null;
  testResult: TestResultType | null;
  setColor: (color: string) => void;
  setTags: (tags: string[]) => void;
  setContent: (content: string) => void;
  setImg: (img: File | null) => void;
  setTestResult: (result: TestResultType) => void;
};
