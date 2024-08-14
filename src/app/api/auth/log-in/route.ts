import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = await request.json();
  const email = data.email as string;
  const password = data.password as string;

  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    console.error('로그인 에러=>', error.status);
    return NextResponse.json({ message: '로그인에 실패했습니다.' }, { status: error.status });
  } else {
    return NextResponse.json({ message: '로그인에 성공하였습니다.' }, { status: 200 });
  }
}
