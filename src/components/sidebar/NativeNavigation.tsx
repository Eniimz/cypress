import React from 'react'
import CypressHomeIcon from '../icons/cypressHomeIcon'
import CypressSettingsIcon from '../icons/cypressSettingsIcon'
import CypressTrashIcon from '../icons/cypressTrashIcon'
import Link from 'next/link'
import Settings from '../settings/Settings'

type NativeNavigationProps = {
    myWorkspaceId: string
}

const NativeNavigation: React.FC<NativeNavigationProps> = ({

    myWorkspaceId

}) => {
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

        <Settings>

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
        '>
            <CypressTrashIcon />

            <span 
            className='text-muted-foreground'>
                Trash
            </span>
        </div>

        
    </nav>
  )
}

export default NativeNavigation