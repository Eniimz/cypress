import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest){ // the name of the file should be 'middleware.ts'

    const res = NextResponse.next()

    const supabase = createMiddlewareClient({ req, res })

    const { data: { session } } = await supabase.auth.getSession()

    if(req.nextUrl.pathname.startsWith('/dashboard')){
        if(!session){
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }
    
    const emailLinkError = "Email link is invalid or has expired"
    
    //if theres an email error, then it should be shown at signup and users should not 
    //be allowed to go to private routes i.e /dashboard

    if (req.nextUrl.searchParams.get('error_description') === emailLinkError && 
        req.nextUrl.pathname !== '/signup'){
            return NextResponse.redirect(new URL(
                `/signup?error_description=${req.nextUrl.searchParams.get('error_description')}`, req.url))
        }

        // console.log(req.nextUrl.pathname)

    if(['/login', '/signup'].includes(req.nextUrl.pathname)){
        // console.log("Running the login middleware condition")
        if(session){
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    }    

    return res;  //important if not returned the middleware wont allow to move to next route
}