'use client'

import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { useSubscriptionModal } from '@/lib/providers/subscription-modal-providor'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'
import { getStripe } from '@/lib/stripe/stripeClient'
import { formatPrice, postData } from '@/lib/utils'
import { useSupabaseContext } from '@/lib/providers/supabaseUserProvider'
import { price, ProductWithPrice } from '@/lib/supabase/supabase.types'

type SubscriptionModalProps = {
  products: ProductWithPrice[]
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ products }) => {

    const { open, setOpen } = useSubscriptionModal()

    const {user, subscription} = useSupabaseContext()

    const upgradeSubscription = async (price: price) => {
        try {
            if (!user) {
              toast({ title: 'You must be logged in' });
              return;
            }
            if (subscription) {
              toast({ title: 'Already on a paid plan' });
              return;
            }
            const { sessionId } = await postData(
              '/api/create-checkout-session', 
              price
            );
      
            console.log('The data received from srever: ', sessionId)
            const stripe = await getStripe();
            stripe?.redirectToCheckout({ sessionId });
          } catch (error) {
            console.log("The error in upgrading: ", error)
            toast({ title: 'Oppse! Something went wrong.', variant: 'destructive' });
          } 
    }

  return (
    <Dialog
    open = {open}
    onOpenChange={setOpen}
    >
        <DialogContent>
            <DialogHeader className='flex flex-col gap-3'>
                <DialogTitle>
                    Upgrade to a Pro Plan
                </DialogTitle>
                <DialogDescription>
                    To access pro features you need to have a pro plan
                </DialogDescription>
            </DialogHeader>

{/* Here we are mapping over Stripe Products. In stripe, products and prices
are different entities, so one product can have many prices, e.g one price is monthly, the other price is
yearly, so while mapping over products, we also have to map over prices inside one product and show all the prices
of a product, in this case tho we only have a single product which has a single price
*/}

            {products && products.length ?
              products.map((product) => (
                <div
                key={product.id}
                className='
                flex
                justify-between
                items-center
                '
                >
                  {
                    product.prices?.map((price) => (
                      <React.Fragment
                      key={price.id}
                      >
                        <b className='text-3xl text-foreground'>
                          {formatPrice(price)} / <small>{price.interval}</small>
                        </b>
                        <Button className='font-bold text-md p-4'
                        onClick={() => upgradeSubscription(price)}
                        >
                         Upgrade ✨
                        </Button>
                      </React.Fragment>
                    )) 
                    
                  }
                </div>
              )) :
              ''
            }

        </DialogContent>
    </Dialog>
  )
}

export default SubscriptionModal