'use client'

import React, { useEffect, useState } from 'react'
import CypressDiamondIcon from '../icons/cypressDiamongIcon'
import { Progress } from '../ui/progress'
import { folder } from '@/lib/supabase/supabase.types'
import { Button } from '../ui/button'
import { v4 } from 'uuid'
import { createFolder } from '@/lib/supabase/queries'
import { useAppContext } from '@/lib/providers/state-provider'

type PlanUsageProps = {
    workspaceFoldersLength: number,
    workspaceId: string
}

const PlanUsage: React.FC<PlanUsageProps> = ({ workspaceFoldersLength, workspaceId }) => { 

    const defaultValue = workspaceFoldersLength/3 * 100

    const [usagePercentage, setUsagePercentage] = useState(defaultValue)

    const { state } = useAppContext();

    useEffect(() => {

        const statefolders = state.workspaces.find(
            (workspace) => workspace.id === workspaceId)?.folders

            console.log("The stateFolders use Effect ran...:", statefolders?.length)

        if(!statefolders) return

        setUsagePercentage(statefolders.length/3 * 100)

    }, [state])

  return (
    <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>

                <div className='h-4 w-4'>
                    <CypressDiamondIcon />
                </div>

                <p 
                className='
                text-sm 
                text-Neutrals/neutrals-9
                '>
                    Free Plan
                </p>

                </div>

                <p 
                className='text-sm
                text-muted-foreground
                text-Neutrals/neutrals-9'
                >
                    {usagePercentage.toFixed(0)}%/100%
                </p>
        </div>

        <Progress value={usagePercentage} />

        

    </div>
  )
}

export default PlanUsage