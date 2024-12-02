import { getCollaboratedWorkspaces, getFiles, getFolders, getPrivateWorkspaces, getSharedWorkspaces, getUserSubscriptionStatus } from '@/lib/supabase/queries'
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@/lib/supabase/server'
import React, { useEffect } from 'react'
import { cookies } from 'next/headers'
import SelectedWorkspace from './SelectedWorkspace'
import WorkspaceDropdown from './WorkspaceDropdown'
import { workspace } from '@/lib/supabase/supabase.types'
import PlanUsage from './PlanUsage'
import { useAppContext } from '@/lib/providers/state-provider'
import NativeNavigation from './NativeNavigation'
import FoldersDropDownList from './FoldersDropDownList'
import { ScrollArea } from '../ui/scroll-area'
import UserCard from './UserCard'
import { twMerge } from 'tailwind-merge'

type SidebarProps = {
    params: { workspaceId: string }
    classname ?: string
}

const Sidebar: React.FC<SidebarProps>= async ( { params, classname } ) => {

      const supabase = await createClient()

      const { data: { user } } = await supabase.auth.getUser();

      if(!user) return

      const { data: subscriptionData, error: subscriptionError }  = await getUserSubscriptionStatus(user.id)

      if(subscriptionError) return
    
      const [privateWorkspaces, collaboratedWorkspaces, sharedWorkspaces] = await Promise.all([
        getPrivateWorkspaces(user.id),
        getCollaboratedWorkspaces(user.id),
        getSharedWorkspaces(user.id)
      ])

      const {data: workspaceFoldersData, error: FoldersError} = await getFolders(params.workspaceId)

      
      const defaultSelectedWorkspace = [
        ...(privateWorkspaces || []),
        ...(collaboratedWorkspaces || []),
        ...(sharedWorkspaces || [])
      ].find((workspaceId) => workspaceId.id === params.workspaceId) 

      {/* 
        Here we see, we are fetching some data from the db and not even using useEffect
        Like you would do in react, why?

        Cuz this is a server component and not a client component

        client components uses hooks and we dont use those in server components

        Through server components, we are closer to our data center and can fetch data

        A good practice is to use server components for data fetching and use client components at 
        the ends of the tree, at the leaves

        the data and html in server components is executed/rendered also rerendered/reexecuted
        on server side and then sent to the client

        context state is also not accessible here, as state is client side
      */}

  return (
    <aside className={twMerge('hidden p-4 w-[330px] sm:flex sm:flex-col items-start gap-2 justify-between', 
      classname
    )}>
        
        <div className='flex flex-col gap-4 w-full'>
            <WorkspaceDropdown 
            privateWorkspaces = { privateWorkspaces }
            collaboratedWorkspaces = { collaboratedWorkspaces }
            sharedWorkspaces = { sharedWorkspaces }
            defaultValue = { defaultSelectedWorkspace }
            />

            <PlanUsage 
            workspaceFoldersLength = {workspaceFoldersData?.length || 0}
            workspaceId = {params.workspaceId}
            />

            <NativeNavigation 
            myWorkspaceId = { params.workspaceId }
            collaboratedWorkspaces = {[ ...(collaboratedWorkspaces || []), ...(sharedWorkspaces || []) ]}
            />

            <ScrollArea
            className='relative h-[450px] '
            >

              <div className='pointer-events-none
              absolute
              bottom-0
              w-full
              bg-gradient-to-t
              from-background
              to-transparent
              z-40
              h-20
              '/>

                <FoldersDropDownList 
                myWorkspaceId = { params.workspaceId }
                workspacefolders = {workspaceFoldersData}
                />

              


            </ScrollArea>

            

        </div>

        <UserCard subscription = {subscriptionData}/>
    </aside>
  )
}

export default Sidebar