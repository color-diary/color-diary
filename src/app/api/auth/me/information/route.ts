import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const GET = async (): Promise<NextResponse> => {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: AuthError
    } = await supabase.auth.getUser();

    if (AuthError) {
      if (AuthError.message.includes('Auth session missing!')) {
        return NextResponse.json(user, { status: 200 });
      }

      console.error('Supabase Error:', AuthError.message);
      return NextResponse.json({ error: AuthError.message }, { status: 500 });
    }

    if (user) {
      const { data, error } = await supabase.from('users').select('nickname, profileImg').eq('id', user.id);

      if (error) {
        console.error('Supabase Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json({ nickname: null, profileImg: null }, { status: 500 });
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
};
