import WriteForm from '@/components/diary/WriteForm';
import { notFound } from 'next/navigation';
import { validate as uuidValidate } from 'uuid';

const isValidUUID = (id: string) => {
  return uuidValidate(id);
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  if (!isValidUUID(params.id)) {
    return {
      title: '404 Not Found'
    };
  }
  return {
    title: 'Edit Diary'
  };
}

export default function EditPage({ params }: { params: { id: string } }) {
  if (!isValidUUID(params.id)) {
    notFound();
  }

  return <WriteForm />;
}
