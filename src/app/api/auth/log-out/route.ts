import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(): Promise<NextResponse> {
  const supabase = createClient();

  await supabase.auth.signOut();

  return NextResponse.json({ message: '로그아웃 성공.' }, { status: 200 });
}
