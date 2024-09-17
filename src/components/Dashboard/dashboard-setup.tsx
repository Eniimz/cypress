'use client'

import React, { useContext, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { AuthUser } from '@supabase/supabase-js'
import EmojiPicker from '../global/EmojiPicker';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod'
import { workspaceFormSchema } from '@/lib/types';
import { subscription } from '@/lib/supabase/supabase.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';
import { workspace } from '@/lib/supabase/supabase.types';
import { createWorkspace } from '@/lib/supabase/queries';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast"
import Loader from '../global/Loader';
import { useAppContext } from '@/lib/providers/state-provider';

  
    interface DashboardSetupProps {
    user: AuthUser;
    subscription: subscription | null
    }

    
    const supabase = createClientComponentClient();
    
    const DashboardSetup: React.FC<DashboardSetupProps> = ({ user, subscription }) => {
        
    const { state, dispatch } = useAppContext();
        
    const router = useRouter();

    const { toast } = useToast();

    const [selectedEmoji, setSelectedEmoji] = useState('💼')

    const { register, reset, handleSubmit, formState: { isSubmitting: isLoading, errors } } = 
        useForm<z.infer<typeof workspaceFormSchema>>({
       mode: 'onChange', // validation mode triggered on every change event
       defaultValues: {
           workspaceName: '',
           logo: ''
       }
   })

    const onSubmit: SubmitHandler<z.infer<typeof workspaceFormSchema>> = async (value) => {

        const logoFile = value.logo[0];
        const workspaceUuid = uuidv4()

        let filePath = null;

        if(!logoFile) return

        try{
            const { data, error } = await supabase.storage
            .from('workspace-logos')
            .upload(`workspaceLogo.${workspaceUuid}`, logoFile, {
                cacheControl: '3600',
                upsert: true
            })

            if(error){
                console.log("THe error: ", error)
            }

            filePath = data?.path
        }catch(error){
            toast({
                variant: 'destructive',
                title: 'Error!, could not uplaod your workspace logo'
            })
            console.log("error occured during upload to storage")
        }

        try{

            const newWorkspace: workspace = {
        
                id: workspaceUuid,
                createdAt: new Date().toISOString(),
                workspaceOwner: user.id,
                title: value.workspaceName,
                iconId: selectedEmoji,
                data: null,
                inTrash: '',
                bannerUrl: '',
                logo: filePath || null // have to see still where and why this is here
        
            } 
        
            const { data, error: createError } = await createWorkspace(newWorkspace);
        
            if(createError){
                throw new Error()
            }

            if(data) {
                console.log("workspace created successfully")
                console.log("The data from workspace: ", data)
            }

            dispatch({
                type: 'ADD_WORKSPACE',
                payload: { ...newWorkspace, folders: [] } // have to see still where and why folders is here
            })
            //folders field is here to handle the folders of the respective workspace
            toast({
                title: 'Workspace created',
                description: `${newWorkspace.title} created successfully`
            })

            router.replace(`/dashboard/${newWorkspace.id}`) 

        }catch(error){
            console.log(error)
            toast({
                variant: 'destructive',
                title: 'Could not create your workspace',
                description: 'Oops! Something went wrong, and we couldnt create your workspace. Try again or come back later.'
            })
        }finally{
            reset()
        }



}

  return (
    <Card className='w-[820px] h-auto border-muted-foreground'>
        <CardHeader>

            <CardTitle className='text-2xl font-bold'>Create a Workspace</CardTitle>
            <CardDescription className='w-full'>
                Lets create a private workspace to get you started. You can add collaborators later from the 
                workspace settings tab.
            </CardDescription>
        </CardHeader>

            <CardContent className=''>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 '>
                    <div className='text-5xl flex gap-2 '>
                        <EmojiPicker getValue = {(emoji) => setSelectedEmoji(emoji)} >
                            {selectedEmoji}
                        </EmojiPicker>

                        <div className='flex flex-col gap-1 w-full'>
                                <Label htmlFor='workspaceName' 
                                className='text-sm text-muted-foreground'>    
                                Name</Label> 
                                <Input id='workspaceName' 
                                className='p-5 text-muted-foreground' 
                                type='text' 
                                placeholder='Workspace Name'
                                {...register("workspaceName", {
                                    required: 'Workspace name is required'
                                })}/>

                                {/* errors.workspace is some object of type FieldError, you cant expect 
                                react to render an object, we need to specify what property of the error
                                object we want to display                                 */}

                                <small className='text-sm text-red-600 '>
                                {errors.workspaceName?.message} 
                                </small>
                        </div>
                    </div>

                    <div className='flex flex-col w-full gap-1'>
                        <Label 
                        htmlFor='logo' 
                        className='text-sm text-muted-foreground'>
                            Workspace Logo
                        </Label>
                        <Input type='file' 
                        accept='image/*'
                        className='flex items-center cursor-pointer' 
                        {...register("logo", {
                            required: false
                        })}/>
                        <small className='text-sm text-red-600 '>
                                {errors?.logo?.message?.toString()} 
                        </small>

                        <small className='text-sm text-muted-foreground'>
                            To cutomize your workspace, you need to be on a Pro Plan
                        </small>
                    </div>

                    <div className='flex justify-end'>
                        <Button> { isLoading ? <Loader /> : 'Create Workspace' }</Button>
                    </div>


                </form>
            </CardContent>

    </Card>
  )
}

export default DashboardSetup