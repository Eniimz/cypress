import React from 'react'

interface TemplateProps {
    children: React.ReactNode
}

const template: React.FC<TemplateProps> = ({children}) => {
  return (
    <div className='flex p-6 justify-center h-screen'>
        {children}
    </div>
  )
}

export default template