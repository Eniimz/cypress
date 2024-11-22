'use client'

import { appFoldersType, useAppContext } from '@/lib/providers/state-provider'
import { files } from '@/lib/supabase/schema'
import { file, folder } from '@/lib/supabase/supabase.types'
import { stat } from 'fs'
import { FileIcon, FolderIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const TrashContent = () => {

    const { state, workspaceId, folderId } = useAppContext()

    const [folders, setFolders] = useState<appFoldersType[] | []>([])
    const [files, setFiles] = useState<file[] | []>([])

    useEffect(() => {

        const folders = state.workspaces.find(
            workspace => workspace.id === workspaceId)?.folders.filter(folder => 
                folder.inTrash
            ) || []

        const allFiles: file[] = []    

        const files = state.workspaces.find(workspace => workspace.id === workspaceId)?.folders.forEach(
            (folder) => folder.files.forEach(file => {
                file.inTrash && allFiles.push(file)
            }))

        console.log("The folders: ", folders)
        console.log("The files: ", files    )

        setFolders(folders)
        setFiles(allFiles)

    }, [state.workspaces])

  return (

    <section className=''>
        {
            !folders.length && !files.length ?

            <article
            className='flex
            justify-center items-center
            text-sm
            text-muted-foreground
            '
            >There are no trash files here </article>

            :

            <div
            className='flex
            flex-col
            gap-4
            '
            >
                {
                !!folders.length && 
                <div className='flex
                flex-col
                gap-3
                '>
                    <p className='text-md
                    text-muted-foreground
                    '>Folders</p>

                    <div className='flex flex-col gap-1'>
                        {
                            folders?.map((folder) => (
                                <Link
                                href={`/dashboard/${folder.workspaceId}/${folder.id}`}
                                className='hover:bg-muted p-1 rounded-lg'
                                >
                                    <div className='flex
                                    gap-2
                                    ' >
                                        <FolderIcon />

                                        <article
                                        className=''
                                        > {folder.title} 
                                        </article>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>

                </div>}

                {
                    !!files.length && (

                    <div className='flex
                    flex-col
                    gap-3
                    '>  
                        <p className='text-md
                        text-muted-foreground
                        '
                        >Files
                        </p>

                        <div className='flex flex-col gap-1'>
                            {
                                files?.map((file) => (
                                    <Link
                                    href={`/dashboard/${file.workspaceId}/${file.folderId}/${file.id}`}
                                    className='hover:bg-muted p-1 rounded-lg'
                                    >
                                        <div className='flex
                                        gap-2
                                        ' >
                                            <FileIcon />

                                            <article
                                            className=''
                                            > {file.title} 
                                            </article>
                                        </div>
                                    </Link>
                                ))
                            }
                        </div>

                    </div>
                    )

                }
        </div>
        }
    </section>
    
  )
}

export default TrashContent