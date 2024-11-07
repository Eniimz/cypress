import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import React, { useEffect } from 'react'
import { useAppContext } from '../providers/state-provider'
import { useRouter } from 'next/navigation'

const useSupabaseRealtime = () => {
  
    const supabase = createClientComponentClient()

    const { dispatch, state, workspaceId } = useAppContext()

    const router = useRouter()

    useEffect(() => {

        console.log("THE SUPREALTIME EFFECT RAN...")

        const channel = supabase.channel('db-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'files' },
            async (payload) => {
                console.log("The SUPREALITIME Payload: ", payload)
            }
        )
        .subscribe()

        return () => {
            channel.unsubscribe()
        }

    }, [supabase])    

  
    return null
}

export default useSupabaseRealtime