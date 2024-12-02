'use client'

import { workspace } from '@/lib/supabase/supabase.types'
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type SelectedWorkspaceProps = {
    workspace: workspace | undefined
    handleClick: () => void
}

const SelectedWorkspace: React.FC<SelectedWorkspaceProps> = ({ workspace, handleClick }) => {

    const supabase = createClient()

    const [worskspaceLogo, setWorkspaceLogo] = useState('/cypresslogo.svg')

    useEffect(() => {

        if(workspace?.logo){ //if the logo path is present in the db then fetch from storage otherwise use default logo
            const path = supabase.storage.from('workspace-logos').getPublicUrl(workspace.logo)
            setWorkspaceLogo(path?.data.publicUrl)
        }

    }, [workspace])

  return (
    <div className=''>
        <Link 
        onClick={handleClick}
        href={`/dashboard/${workspace?.id}`} 
        className='
        flex 
        flex-row 
        items-center 
        justify-start 
        transition-all 
        gap-4 hover:bg-muted 
        py-1.5 px-2 
        rounded-md
    
        
        '>

            <Image src={worskspaceLogo} alt='workspaceLogo' width={24} height={24} objectFit='cover'/>

            <p 
            className='
            text-md  
            font-300 
            w-[140px]
            whitespace-nowrap
            overflow-hidden
            overflow-ellipsis
            '> 
                { workspace?.title } 
            </p>

        </Link>
    </div>
  )
}

export default SelectedWorkspace