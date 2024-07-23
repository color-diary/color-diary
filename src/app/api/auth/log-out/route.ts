import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.log(error)
    }
    return NextResponse.json("로그아웃");
}