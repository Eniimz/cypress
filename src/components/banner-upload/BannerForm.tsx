'use client'

import React, { useEffect } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { bannerSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppContext } from '@/lib/providers/state-provider'
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@/lib/supabase/client'
import { v4 } from 'uuid'
import { updateFile, updateFolder, updateWorkspace } from '@/lib/supabase/queries'
import { toast } from '../ui/use-toast'
import Loader from '../global/Loader'

type BannerFormProps = {
    dirType: string
}

const BannerForm: React.FC<BannerFormProps> = ({ dirType }) => {

    const { state, dispatch, folderId, workspaceId, fileId } = useAppContext()
    const supabase = createClient()

    const {
        handleSubmit, 
        register,
        formState: { isSubmitting: isLoading, errors }
    } = useForm<z.infer<typeof bannerSchema>>({
        mode: 'onChange',
        resolver: zodResolver(bannerSchema),
        defaultValues: { banner: '' }

    })

    const onSubmit: SubmitHandler<z.infer<typeof bannerSchema>> = async (formData) => {

        let filePath= null;
        const file = formData.banner[0]        
        const id = v4()

        const uploadBanner = async () => {
            
            try{
                const { data, error } = await supabase.storage
                .from('file-banners')
                .upload(`${dirType}banner.${id}`, file, { cacheControl: '5', upsert: true })
                filePath = data?.path
            }catch(error){
                console.log("Error occured while uploading: ", error)
            }
        }



        if(dirType === 'folder'){
            
            if(!folderId || !workspaceId) return

            await uploadBanner()

            console.log('The filePath var after upload: ', filePath)

            dispatch({
                type: 'UPDATE_FOLDER',
                payload: {
                    folderId,
                    workspaceId,
                    folder: { bannerUrl: filePath }
                }
            })

            const { data, error } = await updateFolder(folderId, { bannerUrl: filePath })

            if(data){
                toast({
                    description: 'Banner updated successfully'
                })
            }

        }

        if(dirType === 'workspace'){
            
            if(!workspaceId) return
            
            await uploadBanner()

            dispatch({
                type: 'UPDATE_WORKSPACE',
                payload: {
                    workspaceId,
                    workspace: { bannerUrl: filePath }
                }
            })

            const { data, error } = await updateWorkspace(workspaceId, { bannerUrl: filePath })

            if(data){
                toast({
                    description: 'Banner updated successfully'
                })
            }
            console.log("The banner data: ", data)

        }

        if(dirType === 'file'){
            
            if(!folderId || !workspaceId || !fileId) return
            
            await uploadBanner()

            dispatch({
                type: 'UPDATE_FILE',
                payload: {
                    workspaceId,
                    folderId,
                    fileId,
                    file: { bannerUrl: filePath }
                }
            })

            const { data, error } = await updateFile(folderId, fileId, { bannerUrl: filePath })

            if(data){
                toast({
                    description: 'Banner updated successfully'
                })
            }

        }

    }

    useEffect(() => {
        console.log("The state now after upload: ", state.workspaces.find(workspace => workspace.id === workspaceId))
    }, [state.workspaces])

  return (

        <form 
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-2'
        >
            <Label
            htmlFor='BannerImage'
            className='text-muted-foreground'
            >
                Banner Image
            </Label>

                <Input
                id='BannerImage'
                type='file'
                accept='image/*'
                className='p-2 pb-8 h-6'
                {...register('banner', { 
                    required: 'Banner Image is required'
                },
                    
                )}
                />

            <Button 
            type='submit'
            disabled={isLoading}
            className=''>
                { isLoading ? <Loader /> : 'Upload'}
            </Button>
        </form>

  )
}

export default BannerForm