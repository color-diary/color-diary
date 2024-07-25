import { create } from 'zustand';

import { TestResultType } from '@/types/test.type';
import { tZustandStore } from '@/types/zustandStore.type';

// 주스탠드 스토어 변경 시 type에서도 적절히 변형시켜줘야 함
const zustandStore = create<tZustandStore>((set) => ({
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
