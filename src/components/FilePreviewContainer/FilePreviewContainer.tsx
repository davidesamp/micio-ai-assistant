import { CloseCircleOutlined } from '@ant-design/icons'
import React from 'react'
import styles from './FilePreviewContainer.module.scss'
import { UploadedFile } from '@/model/chat'

interface FilePreviewContainerProps {
  uploadedFiles: UploadedFile[]
  // eslint-disable-next-line no-unused-vars
  onDeleteFile: (fileUid: string) => void
}

export const FilePreviewContainer = ({ uploadedFiles, onDeleteFile }: FilePreviewContainerProps) => {
  const handleDeleteFile = (fileUid: string) => {
    onDeleteFile(fileUid)
  }
  return (
    <div className={styles.FilePreviewContainer}>
      
      {uploadedFiles.map((file) => (
        <div key={file.uid} className={styles.FilePreview}>
          <CloseCircleOutlined className={styles.DeleteIcon} onClick={() => handleDeleteFile(file.uid)} />
          <img src={`data:${file.mimeType};base64,${file.data}`} alt={`Uploaded file ${file.uid}`} />
        </div>
      ))}
    </div>
  )
}
