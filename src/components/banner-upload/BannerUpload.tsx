import React from 'react'
import CustomDialogTrigger from '../global/CustomDialogTrigger'
import BannerForm from './BannerForm'

type BannerUploadProps = {
    dirType: string,
    children: React.ReactNode
}

const BannerUpload: React.FC<BannerUploadProps> = ({ children, dirType }) => {
  return (
    <CustomDialogTrigger
    title='Banner Upload'
    description=''
    content = {<BannerForm dirType={dirType} ></BannerForm>}
    >
        { children }
    </CustomDialogTrigger>
  )
}

export default BannerUpload