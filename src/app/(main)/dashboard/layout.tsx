import React from 'react'

type layoutProps = {
    children: React.ReactNode,
    params: any
}

const layout: React.FC<layoutProps> = ({ children, params }) => {
  return (
    <main className=''>
        {children}
    </main>
  )
}

export default layout