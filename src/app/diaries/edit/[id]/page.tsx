'use client';

import WriteForm from '@/components/diary/WriteForm';
import useZustandStore from '@/zustand/zustandStore';
import { isValidUUID } from '@/utils/paramsValidation';
import { notFound } from 'next/navigation';

const EditPage = ({ params }: { params: { id: string } }) => {
  const { isDiaryEditMode } = useZustandStore();

  if (!isValidUUID(params.id)) {
    notFound();
  }

  if (!isDiaryEditMode) {
    notFound();
  }
  return <WriteForm />;
};

export default EditPage;
