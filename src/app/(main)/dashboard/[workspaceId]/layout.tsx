import MobileSidebar from '@/components/sidebar/mobile-sidebar'
import Sidebar from '@/components/sidebar/Sidebar'
import React from 'react'

type layoutProps = {
    children: React.ReactNode,
    params: any
}

const layout: React.FC<layoutProps> = ({ children, params }) => {
  return (
    <main className='flex h-screen w-screen overflow-hidden'>
      
        
        <Sidebar params = { params }/>

        <MobileSidebar>
          <Sidebar 
          classname='sm:hidden inline-block w-screen'
          params={params} />  
        </MobileSidebar>  

        <div className='p-1 dark:border-Neutals-12/70 border-l-[1px] w-full'>
            {children}
        </div>

    </main>
  )
}

export default layout