'use client'

import { Menu } from 'lucide-react'
import React, { useState } from 'react'
import CypressPageIcon from '../icons/cypressPageIcon'

type MobileSidebarProps = {
    children: React.ReactNode
}


const nativeNavigation = [
  {
    title: 'Sidebar',
    id: 'sidebar',
    customIcon: Menu
  },
  {
    title: 'Pages',
    id: 'pages',
    customIcon: CypressPageIcon
  }
]


const MobileSidebar: React.FC<MobileSidebarProps> = ({ children }) => {
  
  const [selectedNav, setSelectedNav] = useState("")

  return (

    <>

      {selectedNav === 'sidebar' && <div > {children} </div>}

      <nav
      className='
      fixed
      bottom-0
      backdrop-blur-lg
      bg-black/10
      right-0
      left-0
      sm:hidden
      '
      >
        <ul
        className='flex
        justify-between
        p-2
        '
        >
          {
            nativeNavigation.map((menu) => (
              <li
              key={menu.id}
              className='flex
              flex-col
              items-center
              justify-center
              '
              onClick={() => setSelectedNav(menu.id) }
              >
                <menu.customIcon></menu.customIcon>

                <small
                className='dark:text-white'
                >
                  {menu.title}
                </small>
              </li>
            ))
          }
        </ul>
      </nav>

    </>
  )
}

export default MobileSidebar