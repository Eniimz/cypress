import { CLIENTS } from '@/lib/constants'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'

type TitleSectionProps = {
  title: string,
  pill ?: string,
  description ?: string 
}


function TitleSection({ title, description, pill }: TitleSectionProps) {
  return (
    <React.Fragment>

      <section className='flex flex-col items-center justify-center gap-6 mt-6 '>

        <article className='rounded-full 
        dark:bg-gradient-to-r
        dark:from-brand-primaryBlue
        dark:to-brand-primaryPurple
        p-[1px]
        text-sm

        '>
          <div className='rounded-full py-1 px-2 dark:bg-black'>
            {pill}
          </div>
        </article>

        <h1 className='text-5xl md:text-6xl md:w-[1100px] text-center font-bold text-washed-purple-400'>
          {title}
        </h1>

        {description && (

          <>
            <p
            className='
            dark:text-washed-purple-700 
            text-center
            sm:w-[40%]
            
            '
            >
              {description}
            </p>
          </>

        )
          
        }

      </section>

    </React.Fragment>
  )
}

export default TitleSection