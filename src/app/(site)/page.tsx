import TitelSection from '@/components/landing-page/TitelSection'
import { Button, buttonVariants } from '@/components/ui/button';
import Banner from "../../../public/appBanner.png"
import React from 'react'
import Image from 'next/image';
import SubscriptionModal from '@/components/global/SubscriptionModal';


function page() {
  return (

    <section className='bg-background min-h-screen flex flex-col py-4 px-4 items-center'>

      <TitelSection />

      <div
          className="
          p-[2px] 
          mt-6
          rounded-xl
          bg-gradient-to-r
          from-primary
          to-brand-primaryBlue
          sm:w-[300px]
          z-10
        "
        >
          <Button
            // variant="btn-secondary"
            className=" w-full
            rounded-[10px]
            p-6
            text-xl
            bg-background
            
          "
          >
            Get Notion For Free
          </Button>
        </div>

      <div className='relative flex justify-center mt-[-75px] '>

        <Image src={Banner} alt='application-banner' className='w-full'  />

        <div className='bottom-0
        absolute
        bg-gradient-to-t
        dark:from-background
        left-0
        right-0
        top-[50%]
        z-10
        '>

        </div>

      </div>


    </section>
  )
}

export default page