'use client'

import { useAppContext } from '@/lib/providers/state-provider'
import { useSupabaseContext } from '@/lib/providers/supabaseUserProvider'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'
import clsx from 'clsx'

type LogOutProps = {
    children: React.ReactNode
    classname ?: string
}

const LogOut: React.FC<LogOutProps> = ({ children, classname }) => {
    
    const supabase = createClientComponentClient()
    const { user, subscription } = useSupabaseContext()

    const { state } = useAppContext()

    const router = useRouter()

    const onLogOut = async (e: any) => {
        console.log("Log out clicked")

        const { error } = await supabase.auth.signOut()
        router.refresh()
        
        if(error){
            console.log('error: ', error)
        }
        console.log('The state after logging out: ', state)
    }

  return (
    <Button
    size={'lg' }
    variant={'ghost'}
    className={clsx('p-1', classname)}
    onClick={onLogOut}
    >
        {children}
    </Button>
  )
}

export default LogOut