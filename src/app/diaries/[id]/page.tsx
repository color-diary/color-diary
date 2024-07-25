import React from 'react';
import DiaryContainer from '@/components/diary/DiaryContainer';
import { isValidUUID } from '@/utils/paramsValidation';
import { notFound } from 'next/navigation';

const DiaryPage = ({ params }: { params: { id: string } }) => {
  if (!isValidUUID(params.id)) {
    notFound();
  }

  return (
    <>
      <DiaryContainer />
    </>
  );
};

export default DiaryPage;
