import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = await request.json();
  const email = data.email as string;
  const password = data.password as string;

  try {
    const supabase = createClient();

    const {
      data: { user },
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('로그인 에러=>', error.status);
      return NextResponse.json({ message: '로그인에 실패했습니다.' }, { status: error.status });
    }

    if (user) {
      const { data, error } = await supabase.from('users').select('nickname').eq('id', user.id);

      if (error) {
        console.error('Supabase Nickname Select Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json({ nickname: null }, { status: 500 });
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
