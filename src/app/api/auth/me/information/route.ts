import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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

export const PATCH = async (request: NextRequest): Promise<NextResponse> => {
  const data = await request.json();

  const nickname = data.nickname as string;

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
      const { error } = await supabase.from('users').update({ nickname }).eq('id', user.id);

      if (error) {
        console.error('Supabase Nickname Update Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ message: 'Nickname successfully updated.' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Supabase Nickname Update Error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const formData = await request.formData();

  const img = formData.get('img') as File;

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
      const extension = img.name.split('.').slice(-1)[0];
      const newFileName = `${Date.now()}.${extension}`;

      const { error: imageUploadError } = await supabase.storage.from('profileImg').upload(`${newFileName}`, img);

      if (imageUploadError) {
        console.error('Image Upload Error:', imageUploadError);
        throw new Error('Image Upload Error');
      }

      const url = supabase.storage.from('profileImg').getPublicUrl(newFileName);

      const { error: userTableError } = await supabase
        .from('users')
        .update({ profileImg: url.data.publicUrl })
        .eq('id', user.id);

      if (userTableError) {
        console.error('Supabase Add Profile Error:', userTableError.message);
        return NextResponse.json({ error: userTableError.message }, { status: 500 });
      }

      return NextResponse.json({ message: 'Profile successfully added.' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Supabase Add Profile Error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
};
