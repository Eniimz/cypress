import { stripe } from "@/lib/stripe";
import db from "@/lib/supabase/db";
import { getUrl } from "@/lib/utils";
import { NextResponse } from "next/server";



export  async function POST(request: Request){

    const customerId = await request.json()

    try{
        const customer = await db.query.customers.findFirst({
            where: (c, {eq}) => eq(c.id, customerId)
        })
    
        if(!customer) throw new Error('Error fetching the customer')
    
        const { url } = await stripe.billingPortal.sessions.create({
            customer: customer.stripeCustomerId ?? '',
            return_url: `${getUrl()}/dashboard`
        })

        return NextResponse.json({ url })

    }catch(err){
        console.log(err)
        return NextResponse.json({ status: '404'})
    }

 

}