
import React from 'react'
import CustomDialogTrigger from '../global/CustomDialogTrigger'
import SettingsForm from './SettingsForm'
import { useSupabaseContext } from '@/lib/providers/supabaseUserProvider'
import db from '@/lib/supabase/db'
import { collaborators } from '@/lib/supabase/schema'

type SettingsProps = {
    children: React.ReactNode
}

const Settings: React.FC<SettingsProps> = ({ children }) => {
  
  return (
    <CustomDialogTrigger 
    title='Settings'
    description=''
    content = { <SettingsForm /> }
    >
        {children}
    </CustomDialogTrigger>
  )
}

export default Settings