import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE() {
    const supabase = createClient();
    // const { error } = await supabase.auth.signOut();

    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (user) {
        await supabase.auth.signOut()
        return NextResponse.json({ message: '로그아웃 성공.' }, { status: 200})
    }
    // else if (error) {
    //     console.log(error);
    //     return NextResponse.json({ message: '로그아웃 실패.' }, { status: error.status })
    // }
}