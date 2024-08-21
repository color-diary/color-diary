import MainSection from '@/components/main/MainSection';
import { Suspense } from 'react';
export default function MainPage() {
  return (
    <Suspense>
      <MainSection />
    </Suspense>
  );
}
