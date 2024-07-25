import WriteForm from '@/components/diary/WriteForm';
import { isValidDate } from '@/utils/paramsValidation';
import { notFound } from 'next/navigation';

export default function WritePage({ params }: { params: { id: string } }) {
  if (!isValidDate(params.id)) {
    notFound();
  }

  return <WriteForm />;
}
