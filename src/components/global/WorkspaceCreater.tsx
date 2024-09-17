'use client'

import React, { useRef, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Lock, Share } from 'lucide-react'
import { Button } from '../ui/button'
import CollaboratorSearch from './CollaboratorSearch'
import { user, workspace } from '@/lib/supabase/supabase.types'
import { ScrollArea } from '../ui/scroll-area'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { v4 } from 'uuid'
import { useSupabaseContext } from '@/lib/providers/supabaseUserProvider'
import { addCollaborators, createWorkspace } from '@/lib/supabase/queries'
import { useRouter } from 'next/navigation'



const WorkspaceCreater = () => {

  const router = useRouter()

  const [title, setTitle]  = useState('')
  const [permissions, setPermissions] = useState('private')
  const [collaborators, setCollaborators] = useState<user[] | []>([])

  const { user } = useSupabaseContext();

  const removeCollaborator = (collaborator: user) => {
    setCollaborators((prevCollaborators) => 
      prevCollaborators.filter(user => user.id !== collaborator.id)
    )
  }

  const handleCreate = async () => {

    if(!user) return

    if(permissions === 'private'){
      const uuid = v4()

      const newWorkspace: workspace = {
        
        id: uuid,
        createdAt: new Date().toISOString(),
        workspaceOwner: user.id,
        title: title,
        iconId: '💼',
        data: null,
        inTrash: '',
        bannerUrl: '',
        logo: null // have to see still where and why this is here
    } 

    await createWorkspace(newWorkspace)
    router.refresh()
  }

  if(permissions === 'shared'){

    console.log("The shared button click ...")
    const uuid = v4()

    const newWorkspace: workspace = {
        
      id: uuid,
      createdAt: new Date().toISOString(),
      workspaceOwner: user.id,
      title: title,
      iconId: '💼',
      data: null,
      inTrash: '',
      bannerUrl: '',
      logo: null // have to see still where and why this is here
  } 

    await addCollaborators(collaborators, uuid)
    await createWorkspace(newWorkspace)
    router.refresh()
  }

  }

  return (
    <div className='flex flex-col gap-4'>

        <div className='flex flex-col gap-1'>
            <Label 
            htmlFor='workspaceName'
            className='text-muted-foreground '
            >
                Name
            </Label>
            <Input 
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className=''
            name='workspaceName' 
            placeholder='Workspace Name'/>
        </div>
        
        <>
          <Label 
          htmlFor='Permissions'
          className='text-muted-foreground'
          >
            Permissions
          </Label>
          <Select 
          onValueChange={(value) => setPermissions(value)}
          defaultValue={permissions}
          name='Permissions'>
            <SelectTrigger className='-mt-3 h-16'>
              <SelectValue/> 
            </SelectTrigger>

            <SelectContent>
              <SelectItem 
              value='private'>

                <div className='flex items-center justify-center gap-4'>
                  <Lock />

                  <article className='text-left flex flex-col'>
                    <span>
                      Private
                    </span>
                    <p> 
                      Your workspace is private to you,you can choose to refresh it later  
                    </p>
                  </article>
                </div>

              </SelectItem>

              <SelectItem 
              value='shared'>

                <div className='flex items-center justify-center gap-4'>
                <Share className='' />

                <article className='text-left flex flex-col'>
                  <span>
                    Shared
                  </span>
                  <p> 
                    You can invite collaborators
                  </p>
                </article>
                </div>

              </SelectItem>        
            </SelectContent>
          </Select>

          {
            permissions === 'shared' && 
            <CollaboratorSearch
            existingCollaborators = {collaborators}
            getCollaborator = { (user) => setCollaborators([...collaborators, user]) }
            >
              <div className='flex justify-center'>    
                <Button>
                  Add Collaborators
                </Button>
              </div>
            </CollaboratorSearch>
          }

          {
            !!collaborators.length && (
              <ScrollArea 
              className='
              border-muted-foreground/20
              h-[120px] 
              border-[1px] 
              rounded-md
              p-2
              '>

                {
                  collaborators.map((collaborator, i) => (
                    <div key={i} className='flex justify-between p-3'>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src='/avatar.jpeg'/>
                            <AvatarFallback> CN </AvatarFallback>
                        </Avatar>

                        <p className='text-muted-foreground'> {collaborator.email} </p>
                      </div>

                      <Button 
                      onClick={() => removeCollaborator(collaborator)}
                      variant={'secondary'}> 
                      Remove 
                      </Button>
                    </div>
                  ))
                }

              </ScrollArea>
            )
          }
        
        </>


        <div>
            
        </div>

        <Button 
        disabled = {(permissions === 'shared') && (collaborators.length === 0) || !title}
        variant={'secondary'}
        onClick={handleCreate}
        > 
          Create  
        </Button>

    </div>
  )
}

export default WorkspaceCreater