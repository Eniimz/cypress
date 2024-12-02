'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import React from 'react'
import { Button } from '../ui/button'

const ModeToggle = () => {

    const {theme, setTheme} = useTheme()

  return (
    <Button
    size={'icon'}
    variant={'outline'}
    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    className='p-0.5 mb-3 mr-1'
    >

        <Sun 
        className='
        h-[1rem]
        w-[1rem]
        scale-100
        dark:scale-0
        '
        />

{/* scale-0 => hidden
    the Button shadcn has relative in its classname
    the rotate 0 - 90 and transition all give a smooth switch between the two modes on ui
    the dark and light mode features are mostly handled by
      the global.css chosen from shadcn
      next-themes providor
      
*/}

        <Moon 
        className='
        h-[1rem]
        w-[1rem]
        absolute
        scale-0
        rotate-90  
        dark:rotate-0
        dark:scale-100
        transition-all
        '
        />
    </Button>
  )
}

export default ModeToggle