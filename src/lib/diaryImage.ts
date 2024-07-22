import { createClient } from '@/utils/supabase/server';

const supabase = createClient();

export const fetchDiaryImage = async (diaryId: string): Promise<string | null> => {
  const { data, error } = await supabase.from('diaries').select('img').eq('diaryId', diaryId).single();

  if (error) {
    console.error('Error fetching diary img columns:', error);
    throw new Error('Diary not found');
  }

  return data?.img ?? null;
};
