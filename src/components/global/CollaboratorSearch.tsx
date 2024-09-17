import React, { useRef, useState } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Search, SearchCheck, User } from 'lucide-react'
import { Input } from '../ui/input'
import { getSearchResults } from '@/lib/supabase/queries'
import { user } from '@/lib/supabase/supabase.types'
import { ScrollArea } from '../ui/scroll-area'
import Image from 'next/image'
import { Button } from '../ui/button'
import { useSupabaseContext } from '@/lib/providers/supabaseUserProvider'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User as UserIcon } from 'lucide-react'

  

 type CollaboratorSearchProps = {
    children: React.ReactNode,
    existingCollaborators: user[] | []
    getCollaborator : (user: user) => void
 }

const CollaboratorSearch: React.FC<CollaboratorSearchProps> = ({ children, existingCollaborators, getCollaborator }) => {

    const [searchResults, setSearchResults] = useState<user[] | []>([])

    const timerRef = useRef<ReturnType<typeof setTimeout>>() //here we make a timerRef so that we can hold the return value of setTimeout func

    const { user } = useSupabaseContext();

    const addCollaborator = (user: user) => { //moving the collaborator to the parent
        console.log("add button clicked")
        getCollaborator(user)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if(timerRef) clearTimeout(timerRef.current)

        timerRef.current = setTimeout(async () => {

            const results = await getSearchResults(e.target.value);
            setSearchResults(results)
        }, 450)
    }


  return (
    <Sheet>
        <SheetTrigger> {children} </SheetTrigger>
        <SheetContent className='flex flex-col gap-4'>
            <SheetHeader className='flex justify-center items-center flex-col'>
                <SheetTitle>
                    Search For Collaborator
                </SheetTitle>

                <SheetDescription className=''>
                    <p className='text-sm text-center text-muted-foreground'>
                    You can also remove collaborators after adding them from the
                    settings tab.
                    </p>
                </SheetDescription>
            </SheetHeader>

            <div className='flex items-center gap-2'>
                <Search />

                <Input
                placeholder='Search Collaborators'
                onChange={handleChange}
                />
            </div>

            <div className='w-full'>
                <ScrollArea >
                    <div className='w-full flex flex-col gap-4'>
                    {
                        searchResults
                        .filter((result) => 
                            !existingCollaborators?.some(existingUser => existingUser.id === result.id)
                        )
                        .filter((filteresUser) =>
                            filteresUser.id !== user?.id  //removing currentUser
                        )
                        .map((user) => (
                            <div key={user.id} 
                            className='w-full flex items-center 
                            gap-3 
                            p-3 
                            rounded-md 
                            justify-between'>
                                
                                <div className='flex items-center gap-2'>
                                    
                                    <Avatar>
                                        <AvatarImage src={user.avatarUrl || ''}/>
                                        <AvatarFallback> <UserIcon /> </AvatarFallback>
                                    </Avatar>
                                    <p className='overflow-hidden'>
                                        {user.email}
                                    </p>
                                </div>

                                <Button 
                                variant={'secondary'}
                                onClick={() => addCollaborator(user)}>
                                    Add
                                </Button>

                            </div>
                        ))
                    }
                    </div>
                </ScrollArea>
            </div>

        </SheetContent>
    </Sheet>
  )
}

export default CollaboratorSearch