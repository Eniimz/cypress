import React from 'react'
import CustomDialogTrigger from '../global/CustomDialogTrigger'
import TrashContent from './TrashContent'

type TrashProps = {
  children: React.ReactNode
}



const Trash: React.FC<TrashProps> = ({ children }) => {
  return (
    <CustomDialogTrigger
    title='Trash'
    content = {<TrashContent></TrashContent>} 
    >
      {children}
    </CustomDialogTrigger>
  )
}

export default Trash