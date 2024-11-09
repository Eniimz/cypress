import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import React, { useEffect } from 'react'
import { useAppContext } from '../providers/state-provider'
import { useRouter } from 'next/navigation'
import { file, workspace } from '../supabase/supabase.types'

const useSupabaseRealtime = () => {
  
    const supabase = createClientComponentClient()

    const { dispatch, state } = useAppContext()

    const router = useRouter()

    useEffect(() => {

        console.log("THE SUPREALTIME EFFECT RAN...")

        const channel = supabase.channel('db-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'files' },
            async (payload) => {
                console.log("The SUPREALITIME Payload: ", payload)

                if(payload.eventType === 'INSERT'){
                    const {  
                        folder_id: folderId,
                        workspace_id: workspaceId,
                        id: fileId
                    } = payload.new

                    const fileExists = state.workspaces.find((workspace) => 
                        workspace.id === workspaceId)?.folders.find(
                            folder => folder.id === folderId)?.files.find(file => file.id === fileId)

                    // console.log("Workspace Exists in SUPREALTIME? : ", state.workspaces)

                    if(!fileExists){

                        const newFile: file = {
                            id: fileId,
                            title: payload.new.title,
                            data: payload.new.data,
                            bannerUrl: payload.new.banner_url,
                            createdAt: payload.new.created_at,
                            folderId,
                            workspaceId,
                            iconId: payload.new.icon_id,
                            inTrash: payload.new.in_trash,
                            logo: payload.new.logo
                        } 
    
                        dispatch({
                            type: 'ADD_FILE',
                            payload: {
                                file: newFile,
                                folderId,
                                workspaceId
                            }
                        })
                    } 


                }
                else if (payload.eventType === 'DELETE'){

                    let workspaceId = ''
                    let folderId = ''

                    const fileExists = state.workspaces.some(workspace =>
                        workspace.folders.some(folder => 
                            folder.files.some(file => {
                                if(file.id === payload.old.id){
                                    workspaceId = workspace.id,
                                    folderId = folder.id
                                    return true
                                }
                            })
                        )
                    )
                    // console.log()
                    console.log("FileExists: ", fileExists)

                    if(fileExists){
                        dispatch({
                            type: 'DELETE_FILE',
                            payload: {
                                fileId: payload.old.id,
                                folderId,
                                workspaceId
                            }
                        })
                    }

                }
                else if (payload.eventType === 'UPDATE'){

                    dispatch({
                        type: 'UPDATE_FILE',
                        payload: {
                            fileId: payload.new.id,
                            folderId: payload.new.folder_id,
                            workspaceId: payload.new.workspace_id,
                            file: {
                                title: payload.new.title,
                                iconId: payload.new.icon_id,
                                inTrash: payload.new.in_trash
                            }
                        }
                    })

                }



            }
        )
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'workspaces' },
            async (payload) => {
                console.log("THE SUPWORKSPACE PAYLOAD: ", payload)
                if(payload.eventType === 'INSERT'){

                    const workspaceExists = state.workspaces.find
                    (workspace => workspace.id === payload.new.id)

                    console.log('workspaceExists: ', workspaceExists)

                    if(!workspaceExists){

                        const newWorkspace = {
                            id: payload.new.id,
                            bannerUrl: payload.new.banner_url,
                            createdAt: payload.new.created_at,
                            data: payload.new.data,
                            iconId: payload.new.icon_id,
                            inTrash: payload.new.in_trash,
                            logo: payload.new.logo,
                            title: payload.new.title,
                            workspaceOwner: payload.new.workspace_owner,
                            folders: []
                        }

                        router.refresh()

                    }
                    

                }

                if (payload.eventType === 'DELETE'){

                    const workspaceExists = state.workspaces.find(workspace => workspace.id === payload.old.id)

                    if(workspaceExists){
                        router.refresh()
                    }

                }

            }
        )
        .subscribe()

        return () => {
            channel.unsubscribe()
        }

    }, [supabase, state])    

  
    return null
}

export default useSupabaseRealtime