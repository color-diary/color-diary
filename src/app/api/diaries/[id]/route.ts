import { Diary } from '@/types/diary.type';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
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

export const PATCH = async (request: NextRequest) => {
  return NextResponse.json('');
};

export const DELETE = async (request: NextRequest) => {
  return NextResponse.json('');
};
