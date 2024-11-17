import { SubscriptionModalProvider } from '@/lib/providers/subscription-modal-providor'
import { getActiveProductsWithPrice } from '@/lib/supabase/queries'
import { ProductWithPrice } from '@/lib/supabase/supabase.types'
import React from 'react'


type layoutProps = {
    children: React.ReactNode,
    params: any,
}

const layout: React.FC<layoutProps> = async ({ children, params }) => {

  const { data: products, error } = await getActiveProductsWithPrice()

  console.log("THE PRODUCTS RETREIVE FROM STRIPE: ", products.length)

  return ( 
    <main className=''>
      <SubscriptionModalProvider products = {products} > 
        {children}
      </SubscriptionModalProvider>
    </main>
  )
}

export default layout