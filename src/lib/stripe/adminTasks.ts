import Stripe from "stripe"
import { customers, prices, products, subscriptions, users } from "../../../migrations/schema"
import db from "../supabase/db"
import { stripe } from './index'
import { price, product, subscription } from "../supabase/supabase.types"
import { string } from "zod"
import { toDateTime } from "../utils"
import { Console } from "console"
import { use } from "react"
import { eq } from "drizzle-orm"

//these are the functions that are invoked whenever some relevant Event mentioned in webhooks DIR is triggered
//when we create a product on stripe, after completion product.created event is hit, when it is we invoke UpsertProductRecord func
//so this function runs from stripe side so, the The product passed here will be of stripe

export const upsertProductRecord = async (product: Stripe.Product) => { 
    const productData: product = {
        active: product.active,
        description: product.description ?? null,
        id: product.id,
        image: product.images[0] ?? null,
        metadata: product.metadata,
        name: product.name
    }

    try{
        await db.insert(products)
        .values(productData)
        .onConflictDoUpdate({ target: products.id, set: productData })

    }catch(err){
        console.log('Error occured in Creating/Updating Product: ', err)
    }

    console.log('Product inserted/updated: ', product.id)


}

export const upsertPriceRecord = async (price: Stripe.Price) => {

    const priceData: price = {
        id: price.id,
        active: price.active,
        currency: price.currency,
        description: price.nickname ?? null,
        interval: price.recurring?.interval ?? null,
        intervalCount: price.recurring?.interval_count ?? null,
        trialPeriodDays: price.recurring?.trial_period_days ?? null,
        metadata: price.metadata,
        productId: typeof price.product === 'string' ? price.product : null,
        type: price.type,
        unitAmount: price.unit_amount ?? null
    }

    try{

        await db.insert(prices)
        .values(priceData)
        .onConflictDoUpdate({ target: prices.id, set: priceData })

        

    }catch(err){
        console.log('Error occured in creating/updating price Record: ', err)
    }

    console.log('The price updated/inserted: ', price.id)

}


export const createOrRetrieveCustomer = async ({ email, uuid } : { email: string, uuid: string }) => {

    //first we retreive, if cant retreive then create

    try{
        const customer = await db.query.customers.findFirst({
            where: (c, {eq}) => eq(c.id, uuid)
        })

        if(!customer) throw new Error()
        
        return customer.stripeCustomerId    
    }catch(err){

        const customerData: { metadata: { SupabaseUuid: string }, email ?: string } = {
            metadata: {
                SupabaseUuid: uuid
            }
        } 

        try{
            //first we update stripe's customer data system
            const customer = await stripe.customers.create(customerData)
    
            if(customer) customer.email = email //why like this??
    
            //we have two ids
            //one id is the primary key which is the customer id in our customers table in db
            //the other is stripeCustomerID which we get after creating a customer through stripe api
    
            //then also our local db
            const data = await db.insert(customers)
            .values({ id: uuid, stripeCustomerId: customer.id })
    
            return customer.id  
        }catch(err){
            console.log('Error IN CREATING/RETREIVING cusomer: ', err)  
        }


    }

}

export const copyBillingDetails = async (uuid: string, paymentMethodDetails: Stripe.PaymentMethod) => {

    try{

        const { name, address, phone } = paymentMethodDetails.billing_details

        if(!name || !address || !phone) return


        await db.update(users)
        .set({
            billingAddress: { ...address },
            paymentMethod: {...paymentMethodDetails[paymentMethodDetails.type]}
        })
        .where(eq(users.id, uuid))

    }catch(err){
        throw new Error('An error occured in  copying Billing Details')
    }

}

export const manageSubscriptionStatusChange = async (subscriptionId: string, sCustomerId: string, createAction: boolean) => {

    //as the event data we receive is from strip so we are providrd with a stripeCustomerId
    
    try{

        console.log("MANAGING THE SUBSCRIPTION STATUS")

        const customer = await db.query.customers.findFirst({
            where: (c, {eq}) => eq(c.stripeCustomerId, sCustomerId)
        })
        
        console.log("THE sCustomerId: ", sCustomerId)

        if(!customer) throw new Error('Couldnt find customer')

        const { id: uuid } = customer
    
        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['default_payment_method']
        })

        const subscriptionData: subscription = {
            id: subscriptionId,
            priceId: subscription.items.data[0].price.id,
            //@ts-ignore
            status: subscription.status,
            //@ts-ignore
            quantity: subscription.quantity,
            userId: uuid,
            metadata: subscription.metadata ?? null,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            cancelAt: subscription.cancel_at
                    ? toDateTime(subscription.cancel_at).toISOString() 
                    : null,
            canceledAt: subscription.canceled_at
                    ? toDateTime(subscription.canceled_at).toISOString()
                    : null,
            currentPeriodEnd: subscription.current_period_end
                    ? toDateTime(subscription.current_period_end).toISOString():
                    '',
            currentPeriodStart: toDateTime(subscription.current_period_start).toISOString(),
            trialEnd: subscription.trial_end 
                    ? toDateTime(subscription.trial_end).toISOString()
                    : null,
            trialStart: subscription.trial_start ?
                    toDateTime(subscription.trial_start).toISOString()
                    : null,
            created: subscription.created ?
                    toDateTime(subscription.created).toISOString()
                    : '',
            endedAt: subscription.ended_at ?
                    toDateTime(subscription.ended_at).toISOString()
                    : null
        }

        console.log('About to add the data to Db..')

        await db.insert(subscriptions)
        .values(subscriptionData)
        .onConflictDoUpdate({ target: subscriptions.id, set: subscriptionData })

        console.log("The subscription inserted/updated: ", subscription.id)

        if(createAction){
            await copyBillingDetails(uuid, subscription.default_payment_method as Stripe.PaymentMethod)
        }

    }catch(err){
        console.log('The error: ', err)
    }


}














