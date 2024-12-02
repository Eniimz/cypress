// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


export const GET = async (req: NextRequest) => {//check if email properly verified, if so session is provided

    const requestUrl = new URL(req.url);

    const code = requestUrl.searchParams.get('code');

    if(code){
        const supabase = await createClient()

        await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}dashboard`);

}