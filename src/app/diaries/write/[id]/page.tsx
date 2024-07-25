import WriteForm from '@/components/diary/WriteForm';
import { notFound } from 'next/navigation';

const isValidDate = (id: string) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  return datePattern.test(id);
};

export async function generateMetadata({ params }: { params: { id: string } }) {
  if (!isValidDate(params.id)) {
    return {
      title: '404 Not Found'
    };
  }
  return {
    title: 'Write Diary'
  };
}

export default function WritePage({ params }: { params: { id: string } }) {
  if (!isValidDate(params.id)) {
    notFound();
  }

  return <WriteForm />;
}
