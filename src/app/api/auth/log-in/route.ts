import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const email = data.email as string;
    const password = data.password as string;

    console.log('이메일=> ', email);
    console.log('비밀번호=> ', password);
    console.log('데이터=> ', data);

    const supabase = createClient();

    const { data: userData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    console.log(userData);
    console.log(error);
    if (error) {
        console.log('로그인 에러=>', error.status)
        return NextResponse.json({ message: '로그인에 실패했습니다.' }, { status: error.status })
    } else {
        // NextResponse.json({ message: '로그인에 성공하였습니다.' })
        // return NextResponse.json(userData);
        return NextResponse.json({ message: '로그인에 성공하였습니다.', userData }, { status: 200 });
    }
}