// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { createServerClient } from '@supabase/ssr'

import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest){ // the name of the file should be 'middleware.ts'


    let supabaseResponse = NextResponse.next({
        request,
      })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
              supabaseResponse = NextResponse.next({
                request,
              })
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              )
            },
          },
        }
      )
    
    const { data: { session } } = await supabase.auth.getSession()

    if(request.nextUrl.pathname.startsWith('/dashboard')){
        if(!session){
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }
    
    const emailLinkError = "Email link is invalid or has expired"
    
    //if theres an email error, then it should be shown at signup and users should not 
    //be allowed to go to private routes i.e /dashboard

    if (request.nextUrl.searchParams.get('error_description') === emailLinkError && 
        request.nextUrl.pathname !== '/signup'){
            return NextResponse.redirect(new URL(
                `/signup?error_description=${request.nextUrl.searchParams.get('error_description')}`, request.url))
        }

        // console.log(req.nextUrl.pathname)

    if(['/login', '/signup'].includes(request.nextUrl.pathname)){
        // console.log("Running the login middleware condition")
        if(session){
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }    

    return supabaseResponse;  //important if not returned the middleware wont allow to move to next route
}