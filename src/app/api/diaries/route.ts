import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const supabase = createClient();

  const formData = await request.formData();

  const userId = formData.get('userId') as string;
  const color = formData.get('color') as string;
  const tags = formData.get('tags') as string;
  const content = formData.get('content') as string;
  const img = formData.get('img') as File | null;
  const date = formData.get('date') as string;

  if (!userId || !color || !tags || !content || !date) {
    return NextResponse.json({ error: 'All fields except img are required' }, { status: 400 });
  }

  const uploadImage = async (img: File): Promise<string> => {
    const extension = img.name.split('.').slice(-1)[0];
    const imgFileName = `/${crypto.randomUUID()}.${extension}`;

    const { error: imageUploadError } = await supabase.storage.from('diaries').upload(imgFileName, img);

    if (imageUploadError) {
      console.error('Image Upload Error:', imageUploadError);
      throw new Error('Image Upload Error');
    }

    const { data } = supabase.storage.from('diaries').getPublicUrl(imgFileName);

    if (!data?.publicUrl) {
      console.error('Error Getting Image URL');
      throw new Error('Error Getting Image URL');
    }

    return data.publicUrl;
  };

  try {
    const imgURL = img ? await uploadImage(img) : null;

    const { error: diaryInsertError } = await supabase
      .from('diaries')
      .insert({ userId, color, tags: JSON.stringify(tags), content, img: imgURL, date });

    if (diaryInsertError) {
      console.error('Database Error creating diary:', diaryInsertError);
      return NextResponse.json({ error: 'Database Error: Unable to create diary' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Diary created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Server Error processing POST request:', error);
    return NextResponse.json({ error: 'Server Error: Unable to process POST request' }, { status: 500 });
  }
};

export const GET = async (request: NextRequest) => {
  return NextResponse.json('');
};
