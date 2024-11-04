'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import 'quill/dist/quill.snow.css'
import { Button } from '../ui/button';
import { useAppContext } from '@/lib/providers/state-provider';
import { useSupabaseContext } from '@/lib/providers/supabaseUserProvider';
import { getCollaborators, getFolderDetails, getWorkspace, removeFolder, removeWorkspace, updateFile, updateFolder, updateWorkspace } from '@/lib/supabase/queries';
import { toast } from '../ui/use-toast';
import { usePathname, useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import EmojiPicker from '../global/EmojiPicker';
import BannerUpload from '../banner-upload/BannerUpload';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { XCircleIcon } from 'lucide-react';
import { useSocket } from '@/lib/providers/socket-providor';
import { Scope_One } from 'next/font/google';

var TOOLBAR_OPTIONS = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button
];

type QuilEditorProps = {

  dirType: string
  fileId: string

}

type collaborator = {
  id: string;
  avatarUrl: string | null;
  email: string | null;
}

const QuilEditor: React.FC<QuilEditorProps> = ({ dirType, fileId }) => {

  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  const { state, dispatch, workspaceId, folderId } = useAppContext()
  const { user } = useSupabaseContext()
  const { socket, isConnected } = useSocket()

  const saverTimerRef = useRef<ReturnType <typeof setTimeout>  >()

  const [quill, setQuill] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [collaborators, setCollaborators] = useState< collaborator[] | []>([])


  const onChangeEmoji = async (selectedEmoji: any) => {

    if(dirType === 'workspace'){

      if(!workspaceId) return

      dispatch({
        type: 'UPDATE_WORKSPACE',
        payload: {
          workspaceId,
          workspace: { iconId: selectedEmoji }
        }
      })

      const { data, error } = await updateWorkspace(workspaceId, { iconId: selectedEmoji })

    }

    if(dirType === 'folder'){

      if(!folderId || !workspaceId) return

      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          folderId,
          workspaceId,
          folder: { iconId: selectedEmoji }
        }
      })

      const { data, error } = await updateFolder(folderId, { iconId: selectedEmoji })

    }

  }

  const removeBanner = async () => {

    if(dirType === 'folder') {

      if(!folderId || !workspaceId) return

      dispatch({
        type: 'UPDATE_FOLDER',
        payload: { 
          workspaceId,
          folderId,
          folder: { bannerUrl: '' }
         }
      })

      const { data, error } = await updateFolder(folderId, { bannerUrl: '' })
    }

  } 

  const restore = async () => {
    
    if(!workspaceId) return

    console.log("The folderID: ", folderId)
    if(dirType === 'workspace'){
      dispatch({
        type: 'UPDATE_WORKSPACE',
        payload: {
          workspace: { inTrash: '' },
          workspaceId
        }
      })
  
      const { data, error } = await updateWorkspace(workspaceId, { inTrash: '' })
      
      if(data){
        toast({
          description: 'Restored Successfully'
        })
      }
  
      if(error){
        toast({
          variant: 'destructive',
          description: 'Restoring Failed'
        })
      }
    }

    if(dirType === 'folder'){

      if(!folderId) return
     
      dispatch({
        type: 'RESTORE',
        payload: {
          folderId,
          workspaceId,
        }
      })

      const { data, error } = await updateFolder(folderId, { inTrash: '' })
      const { data: fileData, error: fileError } = await updateFile(folderId, { inTrash: '' })

      if(error){
        toast({
          description: 'Folder not restored'
        })
      }

      if(data){
        toast({
          description: 'Folder restored'
        })
      }

    }

    if(dirType === 'file'){

      if(!folderId || !fileId) return

      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          fileId,
          folderId,
          workspaceId,
          file: { inTrash: '' }
        }
      })
  
      const { data, error } = await updateFile(folderId, { inTrash: '' })
      
      if(data){
        toast({
          description: 'Restored Successfully'
        })
      }
  
      if(error){
        toast({
          variant: 'destructive',
          description: 'Restoring Failed'
        })
      }
    }
  }

  const deleteHandler = async () => {

    if(!workspaceId) return

     if(dirType === 'workspace'){

       dispatch({
         type: 'DELETE_WORKSPACE',
         payload: {
           workspaceId
         }
       })
   
       const { data, error } = await removeWorkspace(workspaceId)
   
       if(data){
         toast({
           description: 'Deleted'
         })
       }
   
       router.replace('/dashboard')

     }

     if(dirType === 'folder') {
      if(!folderId) return

      dispatch({
        type: 'DELETE_FOLDER',
        payload: {
          workspaceId,
          folderId
        }
      })

      const { data, error } = await removeFolder(folderId)

      if(data){
        toast({
          description: 'Deleted Folder'
        })
      }

      if(error){
        toast({
          variant: 'destructive',
          description: 'Couldnt Delete Folder'
        })
      }

      router.replace(`/dashboard/${workspaceId}`)

     }

  }


  const wrapperRef = useCallback((wrapper: any) => {
    if (typeof window !== 'undefined') {
      if (wrapper === null) return;
      wrapper.innerHTML = '';

      const editor = document.createElement('div');
      wrapper.append(editor);

      import('quill').then((module) => {

        const Quill = module.default
        const q = new Quill(editor, {
          theme: 'snow',
          modules: {
            toolbar: TOOLBAR_OPTIONS,
            
          },
        });
        
        setQuill(q);
      })
      
    }
  }, []);

  const dirDetails = useMemo(() => {

    if(dirType === 'workspace'){
      
      const details = state.workspaces.find(workspace => workspace.id === workspaceId)
      return details
    }

    if(dirType === 'folder'){
      const details = state.workspaces.find(
        workspace => workspace.id === workspaceId)?.folders.find(
          folder => folder.id === folderId)

          return details
    }

    if(dirType === 'file'){

      const details = state.workspaces.find(workspace => workspace.id === workspaceId)
      ?.folders.find(folder => folder.id === folderId)?.files.find(
        file => file.id === fileId
      )

      return details

    }


    
  }, [state,workspaceId])

  const breadCrumb = useMemo(() => {

    const workspace = state.workspaces.find(workspace => 
      workspace.id === workspaceId
    )

    const workspaceCrumb = workspace && `${workspace.iconId} ${workspace.title}`

    const folder= state.workspaces.find(workspace => 
      workspace.id === workspaceId)?.folders.find(folder =>
        folder.id === folderId
      ) || ''

    const folderCrumb = folder && `/ ${folder?.iconId} ${folder?.title}`

    const file = state.workspaces.find(workspace =>
      workspace.id === workspaceId)?.folders.find(folder =>
        folder.id === folderId)?.files.find(file => 
          file.id === fileId
        ) || ''
      
    const fileCrumb = file && `/ ${file?.iconId} ${file?.title}`


    const finalCrumb = `${workspaceCrumb} ${folderCrumb} ${fileCrumb}`

    // console.log("The workspaceCrumb", workspaceCrumb)
    // console.log("The folderCrumb: ", folderCrumb)
    // console.log("The fileCrumb", fileCrumb)

    return finalCrumb

  }, [state.workspaces, workspaceId, folderId, fileId, pathname])
  



  useEffect(() => {

    if(!quill) return

    const fetchInformation = async () => {

      if(!workspaceId) return
      
      if(dirType === 'workspace'){
        const { data, error } = await getWorkspace(workspaceId) 
        if(!data) return

        quill.setContents(JSON.parse(data[0].data || '' ))

        console.log("I the setContents ran..")

      }

      if(dirType === 'folder'){
        if(!folderId) return
        const { data, error }  = await getFolderDetails(workspaceId, folderId)
        if(!data) return

        quill.setContents(JSON.parse(data[0].data || ''))


      }

    

    }

    fetchInformation()

  }, [quill])


  useEffect(() => {

    const fetchCollaborators = async () => {

      if(!workspaceId) return
      const { data, error } = await getCollaborators(workspaceId)

      if(!data) return

      console.log("The collaborators fetched: ", data)
      setCollaborators(data)
      
    }

    fetchCollaborators()

  }, [])

  useEffect(() => {

    if(!socket || !fileId || !quill) return

    console.log("The create Room event Effect: ", socket)
    socket.emit('create-room', fileId)

  }, [socket, fileId, quill])

  useEffect(() => {

    if(!quill || !socket) return //quill initializes after a setState in a useEffect see obsidian..

    const quillHandler = (delta: any, oldDelta: any, source: any) => {

      if (source !== 'user') return
      console.log("The quill handler ran after the effect")
      if(saverTimerRef.current) clearTimeout(saverTimerRef.current);

      setSaving(true)
      const content = quill.getContents()
      const quilLength = quill.getLength( )

      saverTimerRef.current = setTimeout(async () => {

        if(dirType === 'workspace'){

          dispatch({
            type: 'UPDATE_WORKSPACE',
            payload: {
              workspaceId: fileId,
              workspace: {
                data: JSON.stringify(content)
              }
            }
          })

          await updateWorkspace(fileId, { data: JSON.stringify(content) })

        }

        if(dirType === 'folder'){

          if(!workspaceId) return
          dispatch({
            type: 'UPDATE_FOLDER',
            payload: {
              workspaceId,
              folderId: fileId,
              folder: { data: JSON.stringify(content) }
            }
          })

          await updateFolder(fileId, { data: JSON.stringify(content) })

        }

        if(dirType === 'file'){

          if(!folderId || !workspaceId) return

           dispatch({
            type: 'UPDATE_FILE',
            payload: {
              folderId,
              workspaceId,
              fileId,
              file: { data: JSON.stringify(content) }
            }
           })

           await updateFile(fileId, { data: JSON.stringify(content) })

        }

        setSaving(false)
      }, 850)

      socket.emit('send-changes', delta, fileId)
    }

    quill.on('text-change', quillHandler)

    return () => {
      quill.off('text-change', quillHandler)

    }

  }, [quill])

  useEffect(() => {

    if(!quill || !socket) return
    
    console.log("The receive changes Effect ran(socket): ", socket)

    const socketHandler = (delta: any, id: string) => {

      console.log("I received the changes")
      if(id === fileId){
        quill.updateContents(delta)
      }

    }

    socket.emit('A check')
    socket.on('receive-changes', socketHandler)

    return () => {
      socket.off('receive-changes', socketHandler)
    }

  }, [quill])

  return (
    <div className='flex 
    flex-col 
    items-center
    
    '>

      { isConnected ? <div>Connected</div> : <div> Not connected </div>}

      {
        dirDetails?.inTrash && (

          <div
          className='flex 
          w-full
          justify-center
          items-center
          bg-red-400
          gap-3
          p-2
          text-sm
          '
          >
            <article>
              {`This ${dirType} is in Trash`}
            </article>

            <Button 
            onClick={restore}
            className='bg-transparent border-white'
            variant={'outline'}>  
              Restore
            </Button>

            <Button 
            onClick={deleteHandler}
            className='bg-transparent border-white'
            variant={'outline'}>
              Delete
            </Button>

            <article>
              {dirDetails?.inTrash}
            </article>

          </div>
        )
      }

      <div className='
      p-2 w-full flex gap-2 
      text-lg 
      items-center
      justify-between
      '
      >
        <div className='text-[16px] whitespace-nowrap'>
          {breadCrumb} 
        </div>

        <div className='flex items-center gap-5'>

          <div className='flex items-center'>
            {
              collaborators.map((collaborator_el, i) => (
                <Avatar 
                key={i}
                className={`relative z-${collaborators.length - i} -ml-3  border-2 border-white`}>
                  <AvatarImage>
                      {collaborator_el.avatarUrl}
                  </AvatarImage>
                  <AvatarFallback>
                    {collaborator_el.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) )
            }
          </div>

          {
            saving ?

            <Badge
            className='
            bg-orange-500
            rounded-md'
            variant={'secondary'}
            >
              Saving
            </Badge>

            :

            <Badge
            variant={'secondary'}
            className='
            bg-emerald-600 
            rounded-md
            '
            >
              Saved
            </Badge>
          }

        </div>

      </div>
      
      {
        dirDetails?.bannerUrl && (

          <div 
          className='
          relative
          h-[200px]
          w-full
          3'>
            <Image
            fill//if fill used no need to use width/height and it fills to the first parent that is of relative 
            alt='bannerImg'
            className=''
            src={supabase.storage.from('file-banners')
              .getPublicUrl(dirDetails.bannerUrl).data.publicUrl
            }
            />
          </div>

        )
      }

      <div className=' 
      w-full 
      flex
      flex-col
      items-start
      p-2'>

        
        <div 
        className='text-[80px]'
        >
          <EmojiPicker
            getValue={onChangeEmoji}
          >
            <div 
            className='h-[110px] w-[110px]
            rounded-xl hover:bg-muted flex 
            justify-center items-center
            transition-colors
            '>
              {dirDetails?.iconId}
            </div>
          </EmojiPicker>
        </div>


        <div 
        className='p-0.5 pl-4 flex items-center gap-6 '
        >
          <BannerUpload
          dirType = {dirType}
          >
            <p className='text-muted-foreground text-sm'>
              {dirDetails?.bannerUrl ? 'Update Banner' : 'Upload Banner'}
            </p>
          </BannerUpload>

          {
            dirDetails?.bannerUrl && 
              <div
              className='flex items-center 
              gap-1
              text-sm
              text-muted-foreground
              
              '
              onClick={removeBanner}  
              >

                <XCircleIcon size={14} className=''/>

                <p
                className='text-muted-foreground
                cursor-pointer  
                text-sm
                whitespace-nowrap'
                >
                  Remove Banner
                </p>
              </div>
          }

        </div>

        <div className='p-0.5 pl-4 flex flex-col gap-1 text-muted-foreground '>
          
          <p className='text-3xl font-bold'>
            { dirDetails?.title }
          </p>

          <p className='text-sm text-muted-foreground'>
            { dirType.toUpperCase() }
          </p>

        </div>
      </div>

      <div
      className=' 
      max-w-[800px]
      '
      ref={wrapperRef}
      >
        
      </div>
    </div>
  )
}


export default QuilEditor