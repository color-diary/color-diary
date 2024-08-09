import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const email = data.email as string;
    const password = data.password as string;
    const supabase = createClient();

    const { data: userData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        console.error('인증 에러=>', error.status)
        return NextResponse.json({ message: '인증에 실패했습니다.' }, { status: error.status })
    } else {
        return NextResponse.json({ message: '인증에 성공하였습니다.', userData }, { status: 200 });
    }
}