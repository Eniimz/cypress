'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import EmojiPicker from '../global/EmojiPicker'
import { useAppContext } from '@/lib/providers/state-provider'
import { toast } from '../ui/use-toast'
import { createFile, getFiles, updateFile, updateFolder } from '@/lib/supabase/queries'
import { PlusIcon, TrashIcon } from 'lucide-react'
import clsx from 'clsx'
import { stat } from 'fs'
import { workspaces } from '@/lib/supabase/schema'
import { file } from '@/lib/supabase/supabase.types'
import { v4 } from 'uuid'
import ToolTipComponent from '../global/ToolTipComponent'
import { useRouter } from 'next/navigation'
import { is } from 'drizzle-orm'
import { useSupabaseContext } from '@/lib/providers/supabaseUserProvider'


type DropDownProps = {
  listType: string
  iconId: string,
  title: string
  id: string,
  myWorkspaceId: string
}

const DropDown: React.FC<DropDownProps> = ({ 
  listType,
  id, 
  title, 
  iconId,
  myWorkspaceId
}) => {

  const router = useRouter()

  const { state, dispatch } = useAppContext()
  const { user } = useSupabaseContext();

  const [isClient, setIsClient] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleDoubleClick= () => {
    setIsEditing(true)
  }

  const navigatePage = (id: string) => {
    
    const fId = id.split('folder');

    if(listType === 'folder'){

      router.push(`/dashboard/${myWorkspaceId}/${fId[0]}`)
    }

    if(listType === 'file'){
      router.push(`/dashboard/${myWorkspaceId}/${fId[0]}/${fId[1]}`)
    }


  }

  const onChangeEmoji = async (emoji: any) => {
    
    const fId = id.split('folder')

    if(listType === 'folder'){
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          folderId: fId[0],
          workspaceId: myWorkspaceId,
          folder: { iconId: emoji }
        }
      })
  
      //the reason we dont pass { iconId } in the second parameter is as we are using the var and updating the db with 
      //it immediately after the dispatch, as dispatch is asynchronus we cant use the updated state immediately after as its not updated yet, can be checked by loggin iconId value
      const { data, error } = await updateFolder( fId[0], { iconId: emoji } ) 
  
      if(error){
        toast({
          variant: 'destructive',
          description: 'There was an during updating emoji'
        })
      }
  
      if(data){
        toast({
          title: 'Success',
          description: 'Emoji updated successfully'
        })
      }

    }

    if(listType === 'file'){
      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          folderId: fId[0],
          workspaceId: myWorkspaceId,
          fileId: fId[1],
          file: { iconId: emoji }
        }
      })
  
      //the reason we dont pass { iconId } in the second parameter is as we are using the var and updating the db with 
      //it immediately after the dispatch, as dispatch is asynchronus we cant use the updated state immediately after as its not updated yet, can be checked by loggin iconId value
      const { data, error } = await updateFile( fId[0], fId[1], { iconId: emoji } ) 
  
      if(error){
        toast({
          variant: 'destructive',
          description: 'There was an during updating emoji'
        })
      }
  
      if(data){
        toast({
          title: 'Success',
          description: 'Emoji updated successfully'
        })
      }

    }


  }

  const handleBlur = async () => {

    //onBlur acts when the input tag losses focus
    //when we click on input tag it is focused
    //when we click away it loses focus, that is when onBlur inacts
    //but we dont want this run just when focus is lost but when editing is completed
    //so if input tag is not editing we don want to run this func which updates folder and files

    if(!isEditing) return 

    setIsEditing(false)
    
    const fId = id.split('folder')

    if(listType === 'folder'){
    
      const { data, error } = await updateFolder(fId[0], { title })
      
      if(data){
        toast({
          title: 'Success',
          description: 'Folder updated Successfully'
        })
      }

      if(error){
        toast({
          variant: 'destructive',
          description: 'Folder didnt update'
        })
      }
  
    }

    if(listType === 'file'){
    
      const { data, error } = await updateFile(fId[0], fId[1], { title })
      
      if(data){
        toast({
          title: 'Success',
          description: 'File updated Successfully'
        })
      }

      if(error){
        toast({
          variant: 'destructive',
          description: 'File didnt update'
        })
      }
  
    }


  }

  const folderTitle: string = useMemo(() => {

    const stateTitle = state.workspaces.find((workspace) =>
      workspace.id === myWorkspaceId
    )?.folders.find((folder) => folder.id === id)?.title

    if(stateTitle === title || !stateTitle) return title

    return stateTitle;

  }, [state, myWorkspaceId, title])


  const folderTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    dispatch({
      type: 'UPDATE_FOLDER',
      payload: {
        folderId: id,
        workspaceId: myWorkspaceId,
        folder: { title: e.target.value }
      }
    })

  }

  const fileTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const fId = id.split('folder')

    console.log('fId[1]: ', fId)

    dispatch({
      type: 'UPDATE_FILE',
      payload: {

        workspaceId: myWorkspaceId,
        folderId: fId[0],
        fileId: fId[1],
        file: { title: e.target.value }

      }
    })

  }


  useEffect(() => { //as even client components are pre-rendered on the server
    setIsClient(true) //the emoji library using the window obj which is unavailable in the client thus causing hydration error, with this the error is resolved
  }, [])

  const addFile = async () => {

    const newFile: file = {
      id: v4(),
      folderId: id,
      createdAt: new Date().toISOString(),
      bannerUrl: '',
      data: '',
      iconId: '📄',
      inTrash:'',
      logo: '',
      title: 'Untitled',
      workspaceId: myWorkspaceId
    }
    
    dispatch({
      type: 'ADD_FILE',
      payload: {
        workspaceId: myWorkspaceId,
        folderId: id,
        file: newFile
      }
    })

    const { data, error } = await createFile(newFile);

    if(error){
      toast({
        variant: 'destructive',
        description: 'An Error occured while adding file'
      })
    }
    if(data){
      toast({
        title: 'Success',
        description: 'File added successfully'
      })
    }

  }

  const moveToTrash = async () => {

    if(!user || !user.email) return

    const fId = id.split('folder')

    if(listType == 'folder'){

      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          workspaceId: myWorkspaceId,
          folderId: fId[0],
          folder: { inTrash: `Deleted by ${user.email}` }
        }
      })

      const { data, error } = await updateFolder(fId[0], { inTrash: `Deletd by ${user.email}` })

      if(data){
        toast({
          title: 'Success',
          description: 'Moved to trash successfully'
        })
      }
      if(error){
        toast({
          variant: 'destructive',
          description: 'Cant move to trash'
        })
      }

      
    }

    if(listType == 'file'){

      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          workspaceId: myWorkspaceId,
          folderId: fId[0],
          fileId: fId[1],
          file: { inTrash: `Deleted by ${user.email}` }
        }
      })

      const { data, error } = await updateFile(fId[0], fId[1], { inTrash: `Deletd by ${user.email}` })

      if(data){
        toast({
          title: 'Success',
          description: 'Moved to trash successfully'
        })
      }
      if(error){
        toast({
          variant: 'destructive',
          description: 'Cant move to trash'
        })
      }
      
    }

  }

  const listStyles = clsx('relative', {
    'border-none ml-6 text-[16px] py-1': listType === 'file',
    'border-none text-md': listType === 'folder'
    
  })

  const groupIdentfies = clsx('w-full relative flex items-center overflow-hidden', {
    'group/folder': listType === 'folder',
    'group/file': listType === 'file'
  })

  const hoverStyles = clsx('hidden absolute right-0 gap-2', {
    'group-hover/folder:block': listType === 'folder',
    'group-hover/file:block': listType === 'file'
  })

  return (
    <AccordionItem 
    className={listStyles}
    onClick={(e) => {
      e.stopPropagation()
      navigatePage(id) 
    }}
    value={id}>

        <AccordionTrigger 
        id={listType}
        className='hover:no-underline
        p-1 
        pl-0
        text-sm 
        dark:text-muted-foreground
        cursor-pointer
        '
        
        disabled = { listType === 'file'}
        >
            
            <div className= {groupIdentfies}>

              
              <div className='flex items-center gap-2'>
                  
                  {isClient && 
                  <EmojiPicker getValue={onChangeEmoji}>
                    {iconId}
                  </EmojiPicker>}


                  <input 
                  type="text" 
                  className= { clsx('w-[140px] overflow-hidden text-Neutrals/neutrals-7 outline-none select-none cursor-pointer', {
                    'bg-muted cursor-text': isEditing,
                    'bg-transparent': !isEditing
                  }) } 
                  value={folderTitle}
                  readOnly = {!isEditing}
                  onDoubleClick={handleDoubleClick}
                  onBlur={handleBlur}
                  onChange={listType == 'folder' ? folderTitleChange : fileTitleChange}
                  />
              </div>

              <div className={hoverStyles}>
                
                <div className='flex items-center justify-center gap-2'>

                  {/* <ToolTipComponent message='Delete Folder'> */}
                    <TrashIcon 
                    onClick={moveToTrash}
                    size={16}
                    className='text-Neutrals/neutrals-8 
                    hover:dark:text-white 
                    cursor-pointer'
                    
                    />
                  {/* </ToolTipComponent> */}

                  {
                    listType === 'folder' && (

                    // <ToolTipComponent message='Add File'>
                      <PlusIcon 
                      onClick={addFile}
                      size={16}
                      className='text-Neutrals/neutrals-8 hover:dark:text-white cursor-pointer'
                      />
                    // </ToolTipComponent>
                    )
                  }
                </div>


              </div>

            </div>

        </AccordionTrigger>

        <AccordionContent>

          {
            state.workspaces.find((workspace) =>
            workspace.id === myWorkspaceId)?.folders.find(folder => 
              folder.id === id)?.files.filter(file => !file.inTrash).map(file => {
                const customField = `${id}folder${file.id}`
                return (
                  <DropDown
                  listType='file'
                  id= {customField}
                  iconId={file.iconId}
                  myWorkspaceId={myWorkspaceId}
                  title={file.title}
                  key={file.id}
                  />
                )
              })
          }

        </AccordionContent>
                  

    </AccordionItem>
  )
}

export default DropDown