import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const date = searchParams.get('date') as string;

  if (!date) {
    return NextResponse.json({ error: 'Date are required' }, { status: 400 });
  }

  try {
    const { data, error: diarySelectError } = await supabase
      .from('diaries')
      .select('*')
      .eq('userId', authData.user.id)
      .eq('date', date);

    if (diarySelectError) {
      console.error('Error fetching diaries:', diarySelectError);
      return NextResponse.json({ error: 'Database Error: Unable to fetch diaries' }, { status: 500 });
    }

    if (data.length === 0) {
      return NextResponse.json(false, { status: 200 });
    } else {
      return NextResponse.json(true, { status: 200 });
    }
  } catch (error) {
    console.error('Server Error processing GET request:', error);
    return NextResponse.json({ error: 'Server Error: Unable to process GET request' }, { status: 500 });
  }
};
