

import { stripe } from "@/lib/stripe"
import { createOrRetrieveCustomer } from "@/lib/stripe/adminTasks"
import { getUrl } from "@/lib/utils"
import { createClientComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request){
    
    const quantity = 1;
    const metadata = {}

    const data = await request.json()

    console.log('price : ', data )

    try{
        const supabase = createRouteHandlerClient({ cookies })

        const {
            data: { user }
        } = await supabase.auth.getUser()

        if(!user) return

        console.log("RETEREIVING/CREATING CUSTOMER")
        const customer = await createOrRetrieveCustomer( { email: user?.email || '', uuid: user?.id } )

        
        console.log('CREATING CHECKOUT SESSION')    
        
        const session = await stripe.checkout.sessions.create({
            //@ts-ignore
            // payment_method_types: ['card'],
            // billing_address_collection: 'required',
            customer,   
            line_items: [
                {       
                    price: data.id,
                    quantity
                }
            ],
            mode: 'subscription',
            // allow_promotion_codes: true,
            success_url: `${getUrl()}/dashboard`,
            cancel_url: `${getUrl()}/dashboard`
        })
        
        console.log("The session: ", session)
        return NextResponse.json({ sessionId: session.id })

        
    }catch(err){
        console.log("The error in question: ", err)
        return new NextResponse('Internal Error', )
    }

}