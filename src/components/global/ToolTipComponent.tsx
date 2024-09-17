import React from 'react'
import { Tooltip, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { TooltipContent } from '@radix-ui/react-tooltip'

type ToolTipComponentProps = {
    children: React.ReactNode
    message: string
}

const ToolTipComponent: React.FC<ToolTipComponentProps> = ({ children, message }) => {
  return (
    <TooltipProvider>

        <Tooltip>
            <TooltipTrigger> { children } </TooltipTrigger>

            <TooltipContent> 

                <p className='text-sm'>
                    {message} 
                </p>
            </TooltipContent>
        </Tooltip>

    </TooltipProvider>
  )
}

export default ToolTipComponent