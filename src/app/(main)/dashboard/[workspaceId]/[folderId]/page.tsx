import QuilEditor from '@/components/quil-editor/QuilEditor'
import React from 'react'

type pageProps = {
  params: { folderId: string }
}

const page: React.FC<pageProps> = ({ params }) => {

  return (
    <div>
      <QuilEditor 
      fileId = {params.folderId}
      dirType='folder'
      />
    </div>
  )
}

export default page