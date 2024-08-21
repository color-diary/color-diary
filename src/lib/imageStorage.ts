import { createClient } from '@/utils/supabase/server';

export const uploadImage = async (img: File): Promise<string> => {
  const supabase = createClient();

  const extension = img.name.split('.').slice(-1)[0];
  const filename = `/${crypto.randomUUID()}.${extension}`;

  const { error: imageUploadError } = await supabase.storage.from('diaries').upload(filename, img);

  if (imageUploadError) {
    console.error('Image Upload Error:', imageUploadError);
    throw new Error('Image Upload Error');
  }

  const { data } = supabase.storage.from('diaries').getPublicUrl(filename);

  if (!data?.publicUrl) {
    console.error('Error Getting Image URL');
    throw new Error('Error Getting Image URL');
  }

  return data.publicUrl;
};

export const deleteImage = async (img: string): Promise<void> => {
  const supabase = createClient();

  const filename = img.split('/').slice(-1)[0];

  const { error: imageRemoveError } = await supabase.storage.from('diaries').remove([filename]);

  if (imageRemoveError) {
    console.error('Image Remove Error:', imageRemoveError);
    throw new Error('Image Remove Error');
  }
};
