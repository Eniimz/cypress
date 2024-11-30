'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'
import logo from '../../../public/cypresslogo.svg'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"

import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'


const Header = () => {

  const router = useRouter();
  const [path, setPath] = useState('#path')

  return (
    <header className='p-2 sm:p-4 flex items-center justify-between'> 
        <Link
        href={'/'}
        className='flex items-center gap-2 ml-1'
        >

            <Image src={logo} alt='Cypress Logo' width={25} height={25}/>

            <span className='font-semibold text-lg'> cypress. </span>
        </Link>

        <NavigationMenu className='ml-14 hidden md:flex'>
          <NavigationMenuList className='flex gap-14 outline-none'>
            <NavigationMenuItem>
              <NavigationMenuTrigger 
              onClick={() => setPath('#Resources')}
                className={cn({
                  'dark:text-white': path === '#Resources',
                  'dark:text-white/40': path !== '#Resources',
                  'font-normal': true,
                  'text-xl': true
                })}
                >
                Resources
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid grid-cols-[.75fr_1fr] w-[400px] p-4 gap-2'>
                  <li className='row-span-3'>
                    <span className='bg-gradient-to-b from-muted/50 to-muted
                    flex rounded-md h-full w-full items-end  outline-none no-underline p-6 '>
                      Welcome
                    </span>
                  </li>

                  <ListItem title='Introduction' href='#'>
                   Re-usable components built using Radix UI and Tailwind CSS.
                  </ListItem>

                  <ListItem title='Installation' href='#'>
                    How to install dependencies and structure your app.
                  </ListItem>

                  <ListItem title='Typography' href='#'>
                    Styles for headings, paragraphs, lists...etc
                  </ListItem>
          
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger
              onClick={() => setPath('#pricing')}
              className={cn({
                'dark:text-white': path === '#pricing',
                'dark:text-white/40': path !== '#pricing',
                'font-normal': true,
                'text-xl': true
              })}
              >
                 Pricing 
              </NavigationMenuTrigger>

              <NavigationMenuContent className=''>

                <ul className='flex flex-col p-4 gap-3 w-[300px]'>

                <ListItem title='Pro Plan' href='#'>
                  Unlock full power with collaboration
                </ListItem>

                <ListItem title='Free Plan' href='#'>
                  Great For Teams just starting out
                </ListItem>

                </ul>


              </NavigationMenuContent>

            </NavigationMenuItem>

            <NavigationMenuLink 
            onClick={() => setPath('#testimonial')}
            className={ cn( navigationMenuTriggerStyle(), { 
              'dark:text-white': path === '#testimonial',
              'dark:text-white/40': path !== '#testimonial',
              'font-normal': true,
              'text-xl': true
            }) }
            >
              Testimonial
            </NavigationMenuLink>



          </NavigationMenuList>
        </NavigationMenu>

        <aside className='flex justify-center items-center gap-2'>
          
          <Link href={'/login'}>

          <Button variant= 'btn-secondary'>
              Login
          </Button>

          </Link>

          <Button variant='btn-primary' 
          className='px-3 py-4 sm:px-5 sm:py-6
          ' 
          onClick={() => router.replace('/signup')}>
            Sign Up
          </Button>

        </aside>


    </header>
  )
}

export default Header


const ListItem = React.forwardRef< React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({className, title, children, ...props}, ref) => {

  return (
    
    <li>
      <NavigationMenuLink className='group flex flex-col select-none' ref = {ref}>

        <div className='font-semibold' >
          {title}
        </div>

        <p className='text-sm line-clamp-2 leading-snug text-white/50 group-hover:dark:text-white/70'>
          { children }
        </p>

      </NavigationMenuLink>

    </li>



  )

})

ListItem.displayName = 'ListItem';