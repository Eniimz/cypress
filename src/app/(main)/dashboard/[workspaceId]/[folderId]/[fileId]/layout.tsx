import React from 'react'

type layoutProps = {
    children: React.ReactNode
}

const layout: React.FC<layoutProps> = ({ children }) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default layout