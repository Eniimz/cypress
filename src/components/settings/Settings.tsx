
import React from 'react'
import CustomDialogTrigger from '../global/CustomDialogTrigger'
import SettingsForm from './SettingsForm'
import { useSupabaseContext } from '@/lib/providers/supabaseUserProvider'
import db from '@/lib/supabase/db'
import { collaborators } from '@/lib/supabase/schema'
import { workspace } from '@/lib/supabase/supabase.types'

type SettingsProps = {
    children: React.ReactNode,
    collaboratedWorkspaces: workspace[]
}

const Settings: React.FC<SettingsProps> = ({ children, collaboratedWorkspaces }) => {
  
  return (
    <CustomDialogTrigger 
    title='Settings'
    description=''
    content = { <SettingsForm collaboratedWorkspaces = { collaboratedWorkspaces } /> }
    >
        {children}
    </CustomDialogTrigger>
  )
}

export default Settings