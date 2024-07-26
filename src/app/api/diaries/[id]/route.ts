import { fetchDiaryImage } from '@/lib/diaryImage';
import { deleteImage, uploadImage } from '@/lib/imageStorage';
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
    // 세션 가져오기
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // 세션 유저 아이디와 다이어리 유저 아이디 일치 여부 확인
    if (data.userId !== authData.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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

  if (!color || !tags || !content) {
    return NextResponse.json({ error: 'All fields except img are required' }, { status: 400 });
  }

  try {
    const diaryImg = await fetchDiaryImage(diaryId);

    if (diaryImg) {
      await deleteImage(diaryImg);
    }

    const imgURL = img ? await uploadImage(img) : null;

    const parsedTags = JSON.parse(tags);

    const { error: diaryUpdateError } = await supabase
      .from('diaries')
      .update({ color, tags: parsedTags, content, img: imgURL })
      .eq('diaryId', diaryId);

    if (diaryUpdateError) {
      console.error('Error updating diary:', diaryUpdateError);
      return NextResponse.json({ error: 'Database Error: Unable to update diary' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Diary updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Server Error processing PATCH request:', error);
    return NextResponse.json({ error: 'Server Error: Unable to process PATCH request' }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> => {
  const supabase = createClient();

  const diaryId = params.id;

  if (!diaryId) {
    return NextResponse.json({ error: 'Diary ID is required' }, { status: 400 });
  }

  try {
    const diaryImg = await fetchDiaryImage(diaryId);

    if (diaryImg) {
      await deleteImage(diaryImg);
    }

    const { error: diaryDeleteError } = await supabase.from('diaries').delete().eq('diaryId', diaryId);

    if (diaryDeleteError) {
      console.error('Error deleting diary:', diaryDeleteError);
      return NextResponse.json({ error: 'Database Error: Unable to delete diary' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Diary deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Server Error processing DELETE request:', error);
    return NextResponse.json({ error: 'Server Error: Unable to process DELETE request' }, { status: 500 });
  }
};
