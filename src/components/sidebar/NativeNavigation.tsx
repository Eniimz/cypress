
import React from 'react'
import CypressHomeIcon from '../icons/cypressHomeIcon'
import CypressSettingsIcon from '../icons/cypressSettingsIcon'
import CypressTrashIcon from '../icons/cypressTrashIcon'
import Link from 'next/link'
import Settings from '../settings/Settings'
import { useAppContext } from '@/lib/providers/state-provider'
import { useSupabaseContext } from '@/lib/providers/supabaseUserProvider'
import { updateWorkspace } from '@/lib/supabase/queries'
import { useRouter } from 'next/navigation'
import { toast } from '../ui/use-toast'
import { workspace } from '@/lib/supabase/supabase.types'

type NativeNavigationProps = {
    myWorkspaceId: string
    collaboratedWorkspaces: workspace[]
}

const NativeNavigation: React.FC<NativeNavigationProps> = ({

    myWorkspaceId,
    collaboratedWorkspaces

}) => {

    

    // const moveToTrash = async () => {

    //     if(!user || !workspaceId) return

    //     dispatch({
    //         type: 'UPDATE_WORKSPACE',
    //         payload: {
    //             workspaceId,
    //             workspace: { inTrash: `Deleted by ${user.email}`  }
    //         }
    //     })

    //     const { data, error } = await updateWorkspace(workspaceId, { inTrash: `Deleted by ${user.email}`  } )

    //     if(error){
    //         toast({
    //             variant: 'destructive',
    //             description: 'This workspace couldnt be Trashed'
    //           })
    //     }

    //     if(data){
    //       toast({
    //         description: 'This workspace has been Trashed'
    //       })
    //     }
        
    //     // router.replace('/dashboard') may test sometime later
    // }

  return (
    <nav className='flex flex-col gap-2'>

        <Link 
        href={`/dashboard/${myWorkspaceId}`}
        className='
        flex 
        items-center 
        gap-2 
        transition-all 
        group/native'>
            <CypressHomeIcon />

            <span 
            className='text-muted-foreground'>
                My workspace
            </span>
        </Link>

        <Settings
        collaboratedWorkspaces = { collaboratedWorkspaces }
        >

            <div 
            className='
            flex 
            items-center 
            gap-2
            group/native
            '>
                <CypressSettingsIcon />

                <span 
                className='text-muted-foreground'>
                    Settings
                </span>
            </div>

        </Settings>

        <div 
        className='
        flex 
        items-center 
        gap-2
        group/native 
        cursor-pointer  
        '>   
            {/* inside the svg there is group-hover/native  */}

            <CypressTrashIcon /> 

            <span 
            // onClick={moveToTrash}
            className='text-muted-foreground'>
                Trash
            </span>
        </div>

        
    </nav>
  )
}

export default NativeNavigation