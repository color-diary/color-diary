import { Diary } from '@/types/diary.type';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> => {
  const supabase = createClient();

  const diaryId = params.id;

  if (!diaryId) {
    return NextResponse.json({ error: 'Diary ID is required' }, { status: 400 });
  }

  try {
    const { data, error: diarySelectError } = await supabase
      .from('diaries')
      .select('*')
      .eq('diaryId', diaryId)
      .single();

    if (diarySelectError) {
      console.error('Error fetching diary:', diarySelectError);
      return NextResponse.json({ error: 'Database Error: Unable to fetch diary' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Diary not found' }, { status: 404 });
    }

    const diary: Diary = {
      diaryId: data.diaryId,
      userId: data.userId,
      color: data.color,
      tags: JSON.parse(data.tags),
      content: data.content,
      img: data.img,
      date: new Date(data.date)
    };

    return NextResponse.json(diary, { status: 200 });
  } catch (error) {
    console.error('Server Error processing GET request:', error);
    return NextResponse.json({ error: 'Server Error: Unable to process GET request' }, { status: 500 });
  }
};

export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> => {
  const supabase = createClient();

  const diaryId = params.id;

  if (!diaryId) {
    return NextResponse.json({ error: 'Diary ID is required' }, { status: 400 });
  }

  const formData = await request.formData();

  const color = formData.get('color') as string;
  const tags = formData.get('tags') as string;
  const content = formData.get('content') as string;
  const img = formData.get('img') as File | null;
  const prevImg = formData.get('prevImg') as string | null;

  if (!color || !tags || !content) {
    return NextResponse.json({ error: 'All fields except img are required' }, { status: 400 });
  }

  const updateImage = async (img: File | null, prevImg: string | null): Promise<string | undefined> => {
    if (prevImg) {
      const filename = prevImg.split('/').slice(-1)[0];

      const { error: imageRemoveError } = await supabase.storage.from('diaries').remove([filename]);

      if (imageRemoveError) {
        console.error('Image Remove Error:', imageRemoveError);
        throw new Error('Image Remove Error');
      }
    }

    if (img) {
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
    }
  };

  try {
    const imgURL = (await updateImage(img, prevImg)) || null;

    const parsedTags = JSON.parse(tags);

    const { error: diaryUpdateError } = await supabase
      .from('diaries')
      .update({ color, tags: parsedTags, content, img: imgURL })
      .eq('diaryId', diaryId);

    if (diaryUpdateError) {
      console.error('Error updating diary:', diaryUpdateError);
      return NextResponse.json({ error: 'Database Error: Unable to update diary' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Diary updated successfully' }, { status: 201 });
  } catch (error) {
    console.error('Server Error processing PATCH request:', error);
    return NextResponse.json({ error: 'Server Error: Unable to process PATCH request' }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
  return NextResponse.json('');
};
