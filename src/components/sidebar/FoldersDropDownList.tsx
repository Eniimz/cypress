'use client'

import React, { useEffect, useState } from 'react'
import ToolTipComponent from '../global/ToolTipComponent'
import { PlusIcon } from 'lucide-react'
import { v4 } from 'uuid'
import { createFolder } from '@/lib/supabase/queries'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/lib/providers/state-provider'
import { folder } from '@/lib/supabase/supabase.types'
import { files } from '@/lib/supabase/schema'
import DropDown from './DropDown'
import { Accordion } from '../ui/accordion'
import useSupabaseRealtime from '@/lib/hooks/useSupabaseRealtime'
import { useSupabaseContext } from '@/lib/providers/supabaseUserProvider'
import { useSubscriptionModal } from '@/lib/providers/subscription-modal-providor'

type FoldersDropDownListProps = {
    myWorkspaceId: string,
    workspacefolders: folder[] | null
}

const FoldersDropDownList: React.FC<FoldersDropDownListProps> = ({
    myWorkspaceId,
    workspacefolders
}) => {

    const { state, dispatch } = useAppContext()

    const [folders, setFolders] = useState(workspacefolders)

    const {subscription} = useSupabaseContext()

    const { open, setOpen } = useSubscriptionModal()

    useSupabaseRealtime()

    useEffect(() => {

        console.log("The setFOlder rann..")
        console.log("THe context state before: ", state)
        
        if(!workspacefolders) return


        if(workspacefolders?.length > 0){
            
            dispatch({
                type: 'SET_FOLDERS',
                payload: {
                    workspaceId: myWorkspaceId,
                    folders: workspacefolders.map((folder) => {
                        return {
                            ...folder,
                            files: state.workspaces.find((workspace) =>
                                workspace.id === myWorkspaceId
                            )?.folders.find((f) => f.id === folder.id)?.files || []
                        }
                    })
                }
            })

        }

    }, [workspacefolders]) //see obisdian refernce types heading

    // console.log("The folders state: ", folders)

    const addFolder = async () => {


        if(folders && folders?.length >= 3 && subscription?.status !== 'active') {
            setOpen(true)

            return
        }

        const uuid = v4()

        const newFolder = {
            id: uuid,
            createdAt: new Date().toISOString(),
            title: 'Untitled',
            iconId: '📄',
            data: null,
            inTrash: null,
            logo: null,
            bannerUrl: null,
            workspaceId: myWorkspaceId
        }

        await createFolder(newFolder)
        
        dispatch({
            type: 'ADD_FOLDER',
            payload: {workspaceId: myWorkspaceId, folder: {...newFolder, files: []}}
        })
    
        console.log("after dispatch immediately: ",state.workspaces.find
            ((workspace) => workspace.id === myWorkspaceId) )

        
    }

    useEffect(() => {
        console.log("The folderDropDOwn setFOlders ran")
            setFolders(state.workspaces.find
                ((workspace) => workspace.id === myWorkspaceId)
                ?.folders || [])
    }, [state]) 

    //we use a local state for folders here, cuz if user adds, deletes or updates a folder
    //it will trigger a change in the contextState, 
    //to show these changes on ui
    //we use a local state that depends on the changes of context state
    //so when a user adds folder
    //this useEffect runs updates the local folders state
    //triggers a rerender
    //and shows the added folder on the ui

    //what if we used the context state directly instead of a separate local state?
    // then whenever a user adds a folder( or any other change)
    // the context state is updates
    //we now have the added folder present in the context state
    //but to show this change on ui, we have to use states
    //so we say on any change of state, setState(!value)
    // to trigger a rerender
    // so it seems, in the end we have to use a local state either way
    // this is to show changes made by the user at the time they are made

  return (

    <div className='flex flex-col gap-2'>
        <div className='sticky pr-4 z-20 h-10 group/title flex items-center justify-between bg-background'>
            <span 
            className='text-Neutrals/neutrals-8 font-bold text-xs'>
                FOLDERS
            </span>

            <ToolTipComponent message='Add Folder'>

                <PlusIcon 
                onClick={addFolder}
                size={16}
                className='cursor-pointer 
                hidden 
                group-hover/title:block
                text-Neutrals/neutrals-8
                hover:dark:text-white
                
                '
                />

            </ToolTipComponent>   
        </div>

        <Accordion 
        type='multiple'
        className='pb-20'>
            {
                
                    folders?.filter(folder => !folder.inTrash)
                    ?.map((folder, i) => (
                        <DropDown 
                        listType='folder'
                        key={i}
                        iconId = {folder.iconId}
                        title = {folder.title}
                        id = {folder.id} 
                        myWorkspaceId = {myWorkspaceId}
                        />
                    ))
                
            }
        </Accordion>
    </div>
  )
}

export default FoldersDropDownList