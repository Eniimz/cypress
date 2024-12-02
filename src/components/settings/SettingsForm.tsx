'use client'

import React, { useEffect, useRef, useState } from 'react'
import { 
    Briefcase,
    CreditCard,
    ExternalLink,
    Lock,
    LogOutIcon,
    LucideLogOut,
    PlusIcon,
    Scroll,
    Share,
    User as UserIcon

 } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"
import SubscriptionModal from '../global/SubscriptionModal'
import { Button } from '../ui/button'
import CypressProfileIcon from '../icons/cypressProfileIcon'
import { useSupabaseContext } from '@/lib/providers/supabaseUserProvider'
import { Avatar, AvatarImage } from '../ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { useAppContext } from '@/lib/providers/state-provider'
import { addCollaborators, getCollaborators, getCollaboratorsAsUsers, getCurrentUser, getWorkspace, removeCollaborators, removeWorkspace, updateUser, updateWorkspace } from '@/lib/supabase/queries'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { v4 } from 'uuid'
import { toast } from '../ui/use-toast'
import { eventNames } from 'process'
import { user, workspace } from '@/lib/supabase/supabase.types'
import Loader from '../global/Loader'
import LogOut from '../global/LogOut'
import clsx from 'clsx'
import CollaboratorSearch from '../global/CollaboratorSearch'
import { ScrollArea } from '../ui/scroll-area'
import db from '@/lib/supabase/db'
import { redirect, useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useSubscriptionModal } from '@/lib/providers/subscription-modal-providor'
import { postData } from '@/lib/utils'
import { getStripe } from '@/lib/stripe/stripeClient'
import Stripe from 'stripe'
  
  
type SettingsFormProps = {
    collaboratedWorkspaces: workspace[]
}



const SettingsForm: React.FC<SettingsFormProps> = ({
    collaboratedWorkspaces
}) => {
    

    const router = useRouter()
    const { dispatch, workspaceId, state } = useAppContext();
    const { user: supabaseUser, subscription } = useSupabaseContext()
    const { open, setOpen } = useSubscriptionModal()
    
    let defaultPermission: any = collaboratedWorkspaces.find((workspace) => workspace.id  === workspaceId)

    defaultPermission = defaultPermission ? 'shared' : 'private' 


    
    const supabase = createClientComponentClient()
    
    const titleTimerRef = useRef<ReturnType<typeof setTimeout>>()
    const [pfpUploading, setPfpUploading] = useState(false)
    const [permissions, setPermissions] = useState(defaultPermission)
    const [collaborators, setCollaborators] = useState<user[] | []>([])
    const [workspaceDetails, setWorkspaceDetails] = useState<workspace>()
    const [openAlertDialog, setOpenAlertDialog] = useState(false)


    const avatarStyles = clsx('', {
        'w-16 h-16': state.currentUser?.avatarUrl && !pfpUploading || false
    })


    const onPermissionsChange = (value: string) => {

        if(value === 'private'){
            setOpenAlertDialog(true)
        }else{
            setPermissions(value)
        }


    }

    const onContinue = async () => {

        if (!workspaceId) return

        const { data, error } =  await removeCollaborators(collaborators, workspaceId)
        
        if(data){
            setPermissions('shared')
            setOpenAlertDialog(false)
        }

    }

    const removeCollaborator = async (user: user) => {

        if(!workspaceId) return

        setCollaborators(collaborators.filter((collaborator) => collaborator.id !== user.id))

        await removeCollaborators([user], workspaceId)

    }

    const addCollaborator = async (user: user) => {

        if(!workspaceId) return

        if(subscription?.status !== 'active' && collaborators.length >= 3){
            setOpen(true)
            return
        }


        setCollaborators([...collaborators, user])

        await addCollaborators([user], workspaceId)

    }

    const deleteWorkspace = async () => {

        if(!workspaceId) return

        await removeWorkspace(workspaceId)
        
        toast({
            title: 'Successfully deleted workspace'
        })

        router.replace('/dashboard')
        // router.refresh()

    }

    const onWorkspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if(!workspaceId) return

        dispatch({
            type: 'UPDATE_WORKSPACE',
            payload: {
                workspaceId,
                workspace: { title: e.target.value }
            }
        })

        if(titleTimerRef.current) clearTimeout(titleTimerRef.current)
        
        titleTimerRef.current = setTimeout(async () => {
            await updateWorkspace(workspaceId, { title: e.target.value })
        }, 500)

    }

    const changeWorkspaceLogo = async (e:  React.ChangeEvent<HTMLInputElement>) => {

        if(!e || !e.target || !e.target.files || !workspaceId) return

        const logo = e.target.files[0]

        if(!logo) return

        const uuid = v4()

        const { data, error } = await supabase.storage.from('workspace-logos')
        .upload(`workspaceLogo.${uuid}`,logo)

        if(data){

            dispatch({
                type: 'UPDATE_WORKSPACE',
                payload: {
                    workspaceId,
                    workspace: { title: data.path }
                }
            })

            await updateWorkspace(workspaceId, { logo: data.path })

            toast({
                title: 'Success',
                description: 'Workspace updated successfully'
            })

        }

        if(error){
            toast({
                variant: 'destructive',
                description: 'Workspace didnt update'
            })
        }
        

    }

    const changeProfilePicture = async (e:  React.ChangeEvent<HTMLInputElement>) => {

        if(!e || !e.target.files || !workspaceId) return

        const profilePicture = e.target.files[0]

        if(!profilePicture || !supabaseUser) return

        const uuid = v4()

        const { data, error } =  await supabase.storage.from('avatars')
        .upload(`userAvatar.${uuid}`, profilePicture)

        const filePath = data?.path

        if(data){
            if(!filePath) return
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
            setPfpUploading(true)
            
            if(!publicUrl) return

            dispatch({
                type: 'SET_CURRENT_USER',
                payload: {
                    user: {  avatarUrl:  publicUrl }
                }
            })
            const { data, error } = await updateUser(supabaseUser?.id, { avatarUrl: publicUrl })
            
            
            toast({
                title: 'Success',
                description: `The publicUrl: ${publicUrl}`
            })

            // setPfpUploading(false)
            
        }
        
    }
    
    const onStartPlan = async () => {
    
        setOpen(true)

        //make a post req to checkout-session-route
        //why?
        //to get a session id/url
    }

    const manageSubscription = async (customerId: string) => {
     
        try{
            const result =  await postData('/api/create-portal', customerId)

            if(!result) throw new Error()

            window.location.assign(result.url)

        }catch(err){
            console.log(err)
            throw new Error('An Error in fetching portal: ')
        }
        
    }

    useEffect(() => {
        
        const showingWorkspace =  state.workspaces.find((workspace) => workspace.id === workspaceId)

        if(showingWorkspace) setWorkspaceDetails(showingWorkspace)
        

    }, [workspaceId])

    useEffect(() => {

        const fetchCurrentUser = async () => {

            if(!supabaseUser) return
            const { data, error } = await getCurrentUser(supabaseUser.id)
            
            if(!data) return

            dispatch({
                type: 'SET_CURRENT_USER',
                payload: {
                    user: {
                        id: supabaseUser.id,
                        email: supabaseUser.email,
                        avatarUrl: data[0].avatarUrl
                    }
                }
            })
            
        }

        fetchCurrentUser()

    }, [])

    useEffect(() => {

        if(!workspaceId) return

        const fetchAlreadyCollaborators = async () => {

            const { data, error } = await getCollaboratorsAsUsers(workspaceId)

            if(!data) return

            const newArray: user[] = data.map(data => {
                return data.users
            })

            setCollaborators(newArray)
            
        }

        fetchAlreadyCollaborators()

    }, [])


  return (
    <div className='flex flex-col gap-3'>
        <div className='flex justify-start'>
            <div className='flex items-center gap-2'>
                <Briefcase />
                <p 
                className='text-md'
                >
                    Workspace
                </p>
            </div>
        </div>

        <Separator className='my-3'/>

        <div className='flex flex-col gap-3'>

            <span>
                <Label htmlFor='workspaceName'
                className='text-muted-foreground text-sm'
                >
                    Name
                </Label>

                <Input 
                onChange={onWorkspaceNameChange}
                defaultValue={workspaceDetails?.title}
                name='workspaceName'
                />
            </span>

            <span>
                <Label htmlFor='workspaceLogo'
                className='text-muted-foreground text-sm'
                >
                    Workspace Logo
                </Label>

                <Input 
                name='workspaceLogo'
                // defaultValue={workspaceDetails?.logo || '/cypresslogo.svg'}
                className='p-1 pt-2 pb-2 h-10 text-muted-foreground border-[1px] cursor-pointer'
                type='file'
                onChange={changeWorkspaceLogo}
                disabled = { subscription?.status !== 'active' }
                />
            </span>
        </div>

        {
            subscription?.status !== 'active' && (
                <span>
                    <small className='text-sm text-muted-foreground'>
                        To customize your workspace, you need to be on Pro Plan
                    </small>
                </span>
            )
        }

        <div>
            <Label htmlFor='Permissions'
            className='text-muted-foreground text-sm'
            >
                Permissions
            </Label>

            <Select
            value={permissions}
            onValueChange={(value) => onPermissionsChange(value)}
            >
                <SelectTrigger className='h-24'> 
                    <SelectValue/> 
                </SelectTrigger>

                <SelectContent>
                    <SelectItem 
                    className=''
                    value='private'>

                        <div className='flex items-center gap-4'>
                            <Lock />

                            <div className='flex 
                            flex-col
                            text-left
                            gap-1
                            '>
                                <article> Private </article>

                                <p className=''>
                                    Your workspace is private to you, You can choose to share it later
                                </p>
                            </div>
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
            
            <div 
            className='my-4 flex 
            flex-col 
            items-center 
            justify-center
            gap-3
            '>

            {
                permissions === 'shared' && 
                    <CollaboratorSearch
                    existingCollaborators={collaborators}
                    getCollaborator={addCollaborator}
                    >
                    
                    <Button>
                        <PlusIcon />
                        Add Collaborators
                    </Button>

                    </CollaboratorSearch>
    
            }

            {
                permissions === 'shared' &&

                <ScrollArea
                className='
                h-[120px]
                w-full
                border-muted-foreground/20
                border-[1px]
                rounded-md
                p-2
                '
                >


                        {collaborators.length === 0 ? 

                        (

                            <div 
                            className='
                            flex justify-center items-center
                            absolute right-0 left-0 top-0 bottom-0'>
                                <p 
                                className='
                                text-center
                                text-sm
                                text-muted-foreground
                            
                                '>
                                    There are no collaborators
                                </p>
                            </div>
                            
                        ) :
                        
                        <div>
                            {
                                collaborators.map((collaborator, i) => (

                                    <div key={i} className='flex justify-between p-3'>
                                        <div className='flex items-center gap-3'>
                                            <Avatar className='flex justify-center items-center'>
                                                <AvatarImage src={collaborator.avatarUrl || ''}/>
                                                <AvatarFallback> {collaborator.email?.substring(0, 2)} </AvatarFallback>
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
                        </div>

                        }

                </ScrollArea>
            }

            </div>

        </div>

        <Alert 
        variant={'destructive'}
        className='flex flex-col gap-3 items-start'
        >

            <AlertDescription>
                Warning! Deleting your workspace will permanently delete all data related to this workspace
            </AlertDescription>

            <Button 
            onClick={deleteWorkspace}
            variant={'destructive'}
            size={'sm'}
            className='bg-destructive/40
            border-2
            border-destructive
            text-sm
            '
            >
                Delete Workspace
            </Button>
        </Alert>


        <div className='flex flex-col mt-4'>
            <div className='flex items-center justify-start gap-2'>
                <UserIcon />
                <p>
                    Profile
                </p>
            </div>

            <Separator className='my-4' />

            <div className='flex flex-col items-start gap-3'>

                <div className='flex items-center gap-4'>
                    
                    <Avatar className={avatarStyles}>
                        
                        { pfpUploading && <Loader /> }

                        { state.currentUser?.avatarUrl && (
                            <AvatarImage 
                            onLoad={() => setPfpUploading(false)}
                            src={state.currentUser.avatarUrl} />
                        ) }

                        {!pfpUploading  &&  
                        <AvatarFallback>
                            <CypressProfileIcon />
                        </AvatarFallback>
                        }
                    </Avatar>
                    
                    

                    <div className='flex flex-col '>
                        
                        <p className='
                        text-muted-foreground
                        text-sm
                        '>
                            {supabaseUser?.email}
                        </p>

                        <span>
                            <Label htmlFor='profilePicture'
                            className='text-muted-foreground text-sm'
                            >
                                Profile Picture
                            </Label>

                            <Input 
                            name='profilePicture'
                            type='file'
                            onChange={changeProfilePicture}
                            className='p-3 h-12 border-muted'
                            />
                        </span>

                    </div>

                </div>

                    <div className='pl-1'>
                        <LogOut classname=''>
                            <LucideLogOut className=''/><span className='text-muted-foreground'>Logout</span>
                        </LogOut>

                    </div>
            </div>

            <div className='flex flex-col gap-4 mt-11'>
                <div className='flex items-center gap-3'>
                    <CreditCard />

                    <p className='text-muted-foreground text-sm'>
                        Billing & Plan
                    </p>    
                </div>

                <Separator />

                <div className='flex flex-col gap-4 text-muted-foreground 
                text-sm
                items-start
                '>

                    <article>
                        You are currently on { subscription?.status === 'active' ?
                        'Pro' : 'Free'} Plan
                    </article>   

                    <span className='flex items-center 
                    gap-2
                    '>

                        <p>View Plans</p>

                        <ExternalLink size={16}/>

                    </span>
                    
                    {
                        subscription?.status !== 'active' ? (

                        <Button 
                        onClick={onStartPlan}
                        variant={'secondary'}>
                            Start Plan
                        </Button>
                        ) :
                        (
                        <Button
                        onClick={() => {
                            if(!supabaseUser) return
                            manageSubscription(supabaseUser.id)}
                        }
                        variant={'secondary'}
                        >
                            Manage subscription
                        </Button>
                        )
                    }


                </div>

            </div>

        </div>
        
        <AlertDialog open = {openAlertDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove all the collaborators
                    that are collaborating in this workspace
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpenAlertDialog(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onContinue}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>


    </div>
  )
}

export default SettingsForm