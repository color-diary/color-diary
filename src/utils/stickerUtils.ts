import { createClient } from '@/utils/supabase/client';

// diaryId와 setStickers를 인자로 받도록 함
export const fetchStickers = async (diaryId: string, setStickers: (stickers: any) => void) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('diaryStickers').select('stickerData').eq('diaryId', diaryId).single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (data) {
      setStickers(data.stickersData);
    }
  } catch (error) {
    console.error('Error fetching stickers:', error);
  }
};
