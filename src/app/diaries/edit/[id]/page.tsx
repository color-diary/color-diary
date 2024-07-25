import WriteForm from '@/components/diary/WriteForm';
import { isValidUUID } from '@/utils/paramsValidation';
import { notFound } from 'next/navigation';

export default function EditPage({ params }: { params: { id: string } }) {
  if (!isValidUUID(params.id)) {
    notFound();
  }

  return <WriteForm />;
}
