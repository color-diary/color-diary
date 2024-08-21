import CheckEditMode from '@/components/diary/CheckEditMode';
import WriteForm from '@/components/diary/WriteForm';
import { isValidUUID } from '@/utils/paramsValidation';
import { notFound } from 'next/navigation';

const EditPage = ({ params }: { params: { id: string } }) => {
  if (!isValidUUID(params.id)) {
    notFound();
  }

  return (
    <CheckEditMode>
      <WriteForm />
    </CheckEditMode>
  );
};

export default EditPage;
