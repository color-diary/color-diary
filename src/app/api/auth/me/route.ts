import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const GET = async (): Promise<NextResponse> => {
  try {
    const supabase = createClient();

    const { data: user, error } = await supabase.auth.getUser();

    if (error) {
      if (error.message.includes('Auth session missing!')) {
        return NextResponse.json(user, { status: 200 });
      }

      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
};
