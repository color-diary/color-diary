import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE() {
    const supabase = createClient();
    const {
        data: { user }
    } = await supabase.auth.getUser()

    if (user) {
        await supabase.auth.signOut()
        return NextResponse.json({ message: '로그아웃 성공.' }, { status: 200})
    }
}