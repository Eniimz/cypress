import { Button, buttonVariants } from '@/components/ui/button';
import React, { use } from 'react'
import Image from 'next/image';
import SubscriptionModal from '@/components/global/SubscriptionModal';
import { CLIENTS, PRICING_CARDS, USERS } from '@/lib/constants';
import TitleSection from '@/components/landing-page/TitleSection';

import Banner from "../../../public/appBanner.png"
import Cal from '../../../public/cal.png'
import CustomCard from '@/components/landing-page/Custom-card';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

function page() {
  return (

    <section className=' 
    min-h-screen flex 
    flex-col 
    overflow-hidden
    md:py-4 px-4 
    sm:px-6
    justify-center
    items-center'>

      <TitleSection
      title='All-In-One Collaboration and Productivity Platform'
      pill = '✨ Your Workspace, perfected!'
      />

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

      <div className='relative flex justify-center mt-[-10px] sm:mt-[-75px] '>

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

      <section className='relative w-10/12'>
        
        <div
        className='overflow-hidden flex carousel
        '
        > 


          {

            [...Array(2)].map((arr, i) => (
              <div 

                key={`arr${i}`}
                className='flex
                flex-nowrap
                items-center
                animate-slide 
                '>
                {
                  CLIENTS.map((client) => (
                    <div
                    key={`${client.alt}`}
                    className='flex 
                    items-center shrink-0 
                    m-20
                    w-[200px]
                    ' 
                    >
                        <Image src={client.logo} alt={`${client.alt}`} 
                        width={200}
                        className='object-contain
                        '
                        />
                    </div>
                  ))
                }
              </div>
            ))
            
          }


          
        </div>

      </section>

      <TitleSection
      title='Keep track of your meetings all in one place'
      pill = 'Features'
      description='Capture your ideas, thoughts and meeting notes in a structured and organized way'
      />


        <div
        className='relative
        border-8 
        mt-8
        mb-10
        rounded-3xl 
        border-washed-purple-700
        border-opacity-10
        max-w-[450px] 
        flex
        items-center
        justify-center
          
        '
        >

          <div className="absolute left-0 right-0 
          bottom-[50%] top-0 bg-gradient-to-t 
          from-purple-600/30 
          to-purple-600/40
          blur-[100px] 
          rounded-full" />


          <Image 
          src={Cal}
          alt='calendar'
          className='rounded-2xl z-10'
          />
          
            
      </div>  

      <div className='mt-10'></div>    

      <TitleSection 
      pill='Testimonials'
      title='Trusted by all'
      description='Join thousands of satisfied users who rely on our platform
      for their personal and professional productivity needs'
      />    

      <div
      className='relative
      mt-1x0
      flex flex-col
      px-6
      gap-10
      w-[200%]
      '
      >
        <div
        className='
        absolute
        bottom-[50%]
        top-0
        left-0
        right-0
        bg-brand-primaryPurple/20
        -z-100
        rounded-full
        blur-[120px]
        
        '
        
        />
        {
          [...Array(2)].map((testimonial, index) => (

            <div 
            className={twMerge(
              clsx('mt-10 flex flex-nowrap gap-6 justify-center', {
                'flex-row-reverse': index === 1,
                'animate-[slide_17s_linear_infinite] sm:animate-[slide_250s_linear_infinite]': true,
                'animate-[slide_17s_linear_infinite_reverse] sm:animate-[slide_250s_linear_infinite_reverse]': index === 1,
              }),
              'hover:paused'
            )}
            >

               {
                USERS.map((user, i) => (
                  <CustomCard 
                  avatar={`/avatars/${i + 1}.png`}
                  name={user.name}
                  review={user.message}
                  classname='w-[300px]  sm:w-[500px] sm:h-[230px] bg-gradient-to-t
                  dark:from-border
                  dark:to-background shrink-0
                  '
                  key={user.name} 
                  />
                ))
               } 
              
            </div>  

          ) )

        }
      </div>

      <section className='mt-20 flex flex-col gap-10'>
        <TitleSection 
        pill='Pricing'
        title='The Perfect Plan For You'
        description='Experience all the benefits of our platform. 
        Select a plan that suits for needs and take your productivity to 
        new heights'

        />

        <div
        className='flex flex-col sm:flex-row gap-5 justify-center items-center'
        >
        {
          PRICING_CARDS.map((card) => (
            <CustomCard 
            planType={card.planType}
            price={card.price}
            description={card.description}
            highlightFeature={card.highlightFeature}
            features={card.freatures}
            classname={clsx('w-[320px] h-[520px] background-blur-3xl dark:bg-black/40 relative')}
            />
          ))
        }

        </div>

      </section>

    </section>
  )
}

export default page