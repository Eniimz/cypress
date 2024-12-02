'use client'

import { workspace } from '@/lib/supabase/supabase.types'
import React, { useEffect, useState } from 'react'
import SelectedWorkspace from './SelectedWorkspace'
import CustomDialogTrigger from '../global/CustomDialogTrigger'
import Link from 'next/link'
import Image from 'next/image'
import { Label } from '../ui/label'
import WorkspaceCreater from '../global/WorkspaceCreater'
import { ScrollArea } from '../ui/scroll-area'
import { useAppContext } from '@/lib/providers/state-provider'
import { folders, workspaces } from '@/lib/supabase/schema'

type WorkspaceDropdownProps = {
    privateWorkspaces: workspace[] | undefined,
    collaboratedWorkspaces: workspace[] | undefined,
    sharedWorkspaces: workspace[] | undefined,
    defaultValue: workspace | undefined
}

const WorkspaceDropdown: React.FC<WorkspaceDropdownProps> = (
    { 
        privateWorkspaces, 
        collaboratedWorkspaces,
        sharedWorkspaces ,
        defaultValue
    }) => {
    
        
        const { state, dispatch } = useAppContext()
        
        const [isOpen, setIsOpen] = useState(false);

        const [selectedWorkspace, setSelectedWorkspace] = useState<workspace>()
        
        const onClick = () => {
            
            setIsOpen(!isOpen)
            
        }
        
        useEffect(() => {
            
            console.log("The 'SET_WORKSPACES UseEffect ran...: " )
            
            dispatch({
                type: 'SET_WORKSPACES',
                payload: {
                    workspaces: [
                        ...(privateWorkspaces || []),
                        ...(collaboratedWorkspaces || []),
                        ...(sharedWorkspaces || [])
                    ].map((workspace_obj) => {
                        return {
                            ...workspace_obj,
                            folders: []
                        }
                    })
                }
            })
            
        }, [privateWorkspaces, sharedWorkspaces, collaboratedWorkspaces])
        
        useEffect(() => {

            const ws = state.workspaces.find(workspace => workspace.id === defaultValue?.id)
            if(!ws) return
            setSelectedWorkspace(ws)
        }, [state.workspaces, defaultValue])
        //reason for putting defaultValue here
        //if router.refresh() is done in some part of the app, the useEffect
        //wont run on initial render as it does on traditional refresh, so we pass default
        //value here as well
        
        return (
            <div className='relative'>

        {/*
        by passing selectedWorkspace as a prop here, when ever we change the
        name in settings, the onChange function updates the context state
        Here, we have made a useEffect depending on the state.workspaces Context
        state.When any change occurs we set the localWorkspace state equal to the 
        contextWorkspaceState by .find asn trigger a rerender by setState
        */}
        <div 
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full cursor-pointer'>
            {
                defaultValue ? 
                <SelectedWorkspace handleClick = { onClick } workspace = { selectedWorkspace }/> 
                : 'Select a workspace'
            } 
        </div>

        <div className='absolute'>
            
         {/* origin-top-right    */}
            
        {
            isOpen && (
                        <ScrollArea 
                            className='
                            
                            backdrop-blur-md
                            shadow-md
                            bg-black/10
                            z-50
                            h-[170px]
                            border-muted
                            border-[1px]
                            rounded-md
                            flex
                            flex-col
                            items-center                   
                            
                        '> 
                        <div className=''>
                            {!!privateWorkspaces?.length && (
                                <div className='flex flex-col gap-2 items-center w-full'>

                                    <p className='text-muted-foreground w-full text-sm p-2 pb-0.5 border-muted border-b-[1px]'>Private</p>
                                    {
                                        privateWorkspaces.map(workspace => (
                                            <SelectedWorkspace key={workspace.id} workspace={workspace} handleClick={onClick}/>
                                        ))

                                    }

                                </div>
                            )

                            }

                            {!!sharedWorkspaces?.length && (
                                <div className='flex flex-col gap-2 items-center w-full'>

                                    <p className='text-sm text-muted-foreground w-full p-2 pb-0.5 border-muted border-b-[1px]'>
                                        Sharing
                                    </p>

                                    {
                                        sharedWorkspaces.map(workspace => (
                                            <SelectedWorkspace key={workspace.id} workspace={workspace} handleClick={onClick}/>
                                        ))

                                    }

                                </div>
                            )

                            }

                            {!!collaboratedWorkspaces?.length && (
                                <div className='flex flex-col gap-2 items-center w-full'>

                                    <p className='text-sm text-muted-foreground w-full p-2 pb-0.5 border-muted border-b-[1px]'>
                                        Collaborating
                                    </p>

                                    {
                                        collaboratedWorkspaces.map(workspace => (
                                            <SelectedWorkspace key={workspace.id} workspace={workspace} handleClick={onClick}/>
                                        ))

                                    }

                                </div>
                            )
                            }
                        </div>
                        <CustomDialogTrigger 
                        title = 'Create a Workspace'
                        description = 'Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too.'
                        content = {<WorkspaceCreater />}
                        >

                        <div className='w-full flex items-center justify-center gap-2 dark:hover:bg-muted p-2'>

                            <Label className='flex justify-center items-center bg-muted w-5 h-5 rounded-full'> + </Label>

                            <p className='text-sm text-center'> Create Workspace </p>

                        </div>    

                        </CustomDialogTrigger>

                        </ScrollArea>
                        
     
                )
            }
        </div>

        {/* </div> */}

    </div>
  )
}

export default WorkspaceDropdown