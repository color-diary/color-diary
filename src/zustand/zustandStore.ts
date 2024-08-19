import { TestResultType } from '@/types/test.type';
import { tZustandStore } from '@/types/zustandStore.type';
import { create } from 'zustand';

const zustandStore = create<tZustandStore>()((set) => ({
  color: '',
  tags: [],
  content: '',
  img: null,
  testResult: null,
  isDiaryEditMode: false,
  hasTestResult: false,
  setColor: (color: string) => set({ color }),
  setTags: (tags: string[]) => set({ tags }),
  setContent: (content: string) => set({ content }),
  setImg: (img: File | null) => set({ img }),
  setTestResult: (testResult: TestResultType | null) => set({ testResult }),
  setIsDiaryEditMode: (isDiaryEditMode: boolean) => set({ isDiaryEditMode }),
  setHasTestResult: (hasTestResult: boolean) => set({ hasTestResult })
}));

export default zustandStore;
