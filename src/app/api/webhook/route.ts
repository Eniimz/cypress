import { stripe } from "@/lib/stripe"
import { manageSubscriptionStatusChange, upsertPriceRecord, upsertProductRecord } from "@/lib/stripe/adminTasks";
import Stripe from "stripe";

console.log("The strip is initilizzed?: ", stripe)

export async function POST (request: Request){

    const relevantEvents = new Set([
        'product.created',
        'product.updated',
        'price.created',
        'price.updated',
        'checkout.session.completed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
      ]);

        let body  = await request.text()

        const sig = request.headers.get('stripe-signature')

        console.log("The signature: ", sig)

        if(!sig) return
        
        let event: Stripe.Event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!    
        )

        console.log("The event OBJ: ", event)

        if(relevantEvents.has(event.type)){

            try{
                switch(event.type){
                    case 'product.created':
                    case 'product.updated':
                        await upsertProductRecord(event.data.object as Stripe.Product)    
                        break
                    case 'price.created':
                    case 'price.updated':
                        await upsertPriceRecord(event.data.object as Stripe.Price) 
                    case 'customer.subscription.updated':
                        const subscription = event.data.object as Stripe.Subscription
                        await manageSubscriptionStatusChange(subscription.id, subscription.customer.toString(), false)
                    case 'checkout.session.completed':
                        const checkoutSession = event.data.object as Stripe.Checkout.Session    
                        if(checkoutSession.mode === 'subscription'){
                            const subscriptionId = checkoutSession.subscription
                            await manageSubscriptionStatusChange(subscriptionId as string
                                ,checkoutSession.customer as string, true)

                        }   

                }

            }catch(err){
                throw new Error('A Webhhook Error occured')
            }

        }    

    return new Response('Request received', { status: 200 })
}