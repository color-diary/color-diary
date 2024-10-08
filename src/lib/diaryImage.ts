import { createClient } from '@/utils/supabase/server';

export const fetchDiaryImage = async (diaryId: string): Promise<string | null> => {
  const supabase = createClient();

  const { data, error } = await supabase.from('diaries').select('img').eq('diaryId', diaryId).single();

  if (error) {
    console.error('Error fetching diary img columns:', error);
    throw new Error('Diary not found');
  }

  return data?.img ?? null;
};
