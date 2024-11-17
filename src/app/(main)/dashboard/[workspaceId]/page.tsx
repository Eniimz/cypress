import QuilEditor from '@/components/quil-editor/QuilEditor'

type WorkspaceIdPageProps = {
  params: { workspaceId: string }
}

const WorspaceIdPage: React.FC<WorkspaceIdPageProps> = ({ params }) => {

  
  return (
     <div className=''> 

      <QuilEditor 
      dirType = 'workspace'
      fileId= {params.workspaceId}
      />

    </div>
  )
}

export default WorspaceIdPage;   