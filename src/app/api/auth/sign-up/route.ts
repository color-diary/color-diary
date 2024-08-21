import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = await request.json();
  const email = data.email as string;
  const password = data.password as string;
  const nickname = data.nickname as string;

  try {
    const supabase = createClient();

    const {
      data: { user },
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname
        }
      }
    });

    if (error) {
      console.error('회원가입 에러=>', error.status);
      return NextResponse.json({ error: '회원가입에 실패했습니다.' }, { status: error.status });
    }

    if (user) {
      return NextResponse.json(user.id, { status: 200 });
    } else {
      return NextResponse.json({ error: '회원가입에 실패했습니다.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
