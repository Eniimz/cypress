import QuilEditor from '@/components/quil-editor/QuilEditor'
import { getCollaborators } from '@/lib/supabase/queries'
import React from 'react'

type FilePageProps = {
  params: { fileId: string }
}

const FilePage: React.FC<FilePageProps> = ({ params }) => {

  return (
    <div>
      <QuilEditor 
      dirType='file'
      fileId= {params.fileId}
      />
    </div>
  )
}

export default FilePage