import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import dynamic from 'next/dynamic'
import { any } from 'zod'
import { Emoji } from 'emoji-picker-react'
  
interface EmojiPickerProps {
    children: React.ReactNode,
    getValue: (emoji: string) => void
}

const Picker = dynamic(() => import ('emoji-picker-react'))

const EmojiPicker: React.FC<EmojiPickerProps> = ({ children, getValue }) => { 
    
// getValue = (emoji) => setSelectedEmoji(emoji)

const onClick = (selectedEmoji: any) => getValue(selectedEmoji.emoji)

  return (
    <>
      <Popover>
          <PopoverTrigger className=''> {children} </PopoverTrigger>

          <PopoverContent className='p-0 border-none'> 
            <Picker onEmojiClick={onClick} /> 
          </PopoverContent>
          
      </Popover>
    </>
  )
}

export default EmojiPicker