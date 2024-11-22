import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'

type CustomDialogTriggerProps = {
    title: string,
    description?: string,
    children: React.ReactNode
    content: React.ReactNode
}

const CustomDialogTrigger: React.FC<CustomDialogTriggerProps> = ({ 
  title, 
  description, 
  children, 
  content 
}) => {

  return (
    <Dialog>
        <DialogTrigger className='w-full'> {children} </DialogTrigger>
        <DialogContent
        className='
        h-screen
        sm:h-[440px] 
        flex
        flex-col       
        '
        >
            <DialogHeader className='' >
                <DialogTitle> {title} </DialogTitle>
                <DialogDescription> {description} </DialogDescription>
            </DialogHeader>

            <ScrollArea
            className=''
            >

              {content}

            </ScrollArea>


        </DialogContent>
    </Dialog>
  )
}

export default CustomDialogTrigger