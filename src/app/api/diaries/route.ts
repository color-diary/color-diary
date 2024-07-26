import { uploadImage } from '@/lib/imageStorage';
import { Diary } from '@/types/diary.type';
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

  try {
    const imgURL = img ? await uploadImage(img) : null;

    const parsedTags = JSON.parse(tags);

    const { error: diaryInsertError } = await supabase
      .from('diaries')
      .insert({ userId, color, tags: JSON.stringify(parsedTags), content, img: imgURL, date });

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

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const supabase = createClient();

  /*
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  */

  const { searchParams } = new URL(request.url);

  const year = searchParams.get('year') as string;
  const month = searchParams.get('month') as string;

  if (!year || !month) {
    return NextResponse.json({ error: 'Year and month are required' }, { status: 400 });
  }

  try {
    const startDate = new Date(Number(year), Number(month) - 1, 1).toISOString();
    const endDate = new Date(Number(year), Number(month), 1).toISOString();

    const { data, error: diarySelectError } = await supabase
      .from('diaries')
      .select('*')
      //.eq('userId', authData.user.id)
      .eq('userId', '79c7d4d1-7c18-4766-92eb-2e80cd2ab30c')
      .gte('date', startDate)
      .lt('date', endDate);

    if (diarySelectError) {
      console.error('Error fetching diaries:', diarySelectError);
      return NextResponse.json({ error: 'Database Error: Unable to fetch diaries' }, { status: 500 });
    }

    const diaries: Diary[] = data.map((diary) => ({
      diaryId: diary.diaryId,
      userId: diary.userId,
      color: diary.color,
      tags: JSON.parse(diary.tags),
      content: diary.content,
      img: diary.img,
      date: new Date(diary.date)
    }));

    return NextResponse.json(diaries, { status: 200 });
  } catch (error) {
    console.error('Server Error processing GET request:', error);
    return NextResponse.json({ error: 'Server Error: Unable to process GET request' }, { status: 500 });
  }
};
