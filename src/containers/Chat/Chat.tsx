import { theme, List, Card } from 'antd'
import { Typography } from 'antd'
import cx from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { v4 as uuidv4 } from 'uuid'
import PlaceholderImage from '../../icons/micio-ai-pink.png'
import { useMicioStore } from '../../store'
import styles from './Chat.module.scss'
import { FilePreviewContainer } from '@/components/FilePreviewContainer/FilePreviewContainer'
import ImageRenderer from '@/components/ImageRenderer/ImageRenderer'
import { MicioTextarea } from '@/components/MicioTextarea/MicioTextarea'
import useGenerateContent from '@/hooks/useGenerateContent'
import CatLogoSpin from '@/icons/cat-logo-spin.svg'
import CatLogo from '@/icons/cat-logo.svg'
import { ContentTypes, Message, UploadedFile } from '@/model/chat'
import { fileToBase64 } from '@/utils/fileUtils'

const Chat = () => {
  const {
    token: { colorBgContainer, borderRadiusLG, colorBgContainerDisabled },
  } = theme.useToken()

  const { 
    chat: { 
      messages,
    },
    ui: { 
      currentAiProvider,
    },
  } = useMicioStore()

  const { Title } = Typography

  const { isGenerating, generate } = useGenerateContent()
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [localIsGenerating, setLocalIsGenerating] = useState(isGenerating)

  const [statement, setStatement] = useState('')
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }

  useEffect(() => {
    if(isGenerating !== localIsGenerating) {
      setLocalIsGenerating(isGenerating)  
      scrollToBottom()
    }
  }, [isGenerating, localIsGenerating])

  const handleSend = () => {
    generate(statement, uploadedFiles)
    setStatement('')
    setUploadedFiles([])
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0])
      const file: UploadedFile = {
        data: base64,
        mimeType: e.target.files[0].type,
        uid: uuidv4(),
      } 

      setUploadedFiles((prevFiles) => [...prevFiles, file])
      textAreaRef.current?.focus()
    }
  }

  const handleDeleteUploadedFile = (uid: string) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.uid !== uid))
  }

  const cardBodyUI = (content: Message) => content.type === ContentTypes.TEXT ? (
    <ReactMarkdown
      children={content.message}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return  match ? (
            // @ts-ignore
            <SyntaxHighlighter
              {...props}
              language={match[1]}
              style={dark}
            >
              {String(content.message).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
      }}
    />
  ): (
      <ImageRenderer imageDataBase64={content.message}/>
  )

  const uploadedFilesUI = (files: UploadedFile[]) => files.map((file) => (
    <div key={file.uid}>
      <img src={`data:${file.mimeType};base64,${file.data}`} alt={`Uploaded file ${file.uid}`} />
    </div>
  ))

  return currentAiProvider ? (
    <div
      style={{        
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
      className={styles.Container}
    >
      <List
        className={styles.ListContainer}
        dataSource={messages}
        renderItem={msg => (
          <div className={styles.ListItemContainer}>
            {isGenerating && msg.sender === 'model' && (
              <div className={styles.LoaderContainer}>
                <CatLogoSpin />
              </div>
            )}
            {!isGenerating && msg.sender === 'model' && (
              <CatLogo className={styles.CatLogo} />
            )}
            <List.Item 
              key={msg.id} 
              className={cx({
              [styles.User]: msg.sender === 'user',
            })}>
              <Card 
                style={{
                  background: msg.sender === 'user' ? colorBgContainerDisabled : colorBgContainer,
                  borderRadius: borderRadiusLG,
                }}
                className={styles.Card}
                variant="outlined" 
                >
                {msg.files && msg.files.length > 0 && (
                  <div className={styles.UploadedFilesContainer}>
                    {uploadedFilesUI(msg.files)}
                  </div>
                  )
                }
                {cardBodyUI(msg)}
              </Card>
            </List.Item>
          </div>  
        
        )}
      />
      
      <div className={styles.TextAreaContainer}>
        <FilePreviewContainer uploadedFiles={uploadedFiles} onDeleteFile={handleDeleteUploadedFile}/>
        <MicioTextarea
          statement={statement}
          onChange={setStatement}
          onSend={handleSend}
          textAreaRef={textAreaRef}
          onFileChange={handleFileChange}
        />
      </div>
    </div> ) : (
    <div className={styles.EmptyStateContainer}>
      <img src={PlaceholderImage} alt="Micio" />
      <Title level={3}>Select an AI provider to start chatting</Title>
    </div>
  )
}

export default Chat