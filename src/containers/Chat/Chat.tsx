import { CopyOutlined } from '@ant-design/icons'
import { theme, List, Card, message } from 'antd'
import cx from 'classnames'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useCopyToClipboard } from 'usehooks-ts'
import { v4 as uuidv4 } from 'uuid'
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
      currentMessageCreatingUid,
    },
  } = useMicioStore()

  const [, copy] = useCopyToClipboard()

  const { isGenerating, generate } = useGenerateContent()
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [localIsGenerating, setLocalIsGenerating] = useState(isGenerating)

  const [messageApi, contextHolder] = message.useMessage()

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

  useEffect(() => {
    SyntaxHighlighter.registerLanguage('jsx', jsx)
  }, [])

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

  const handleCopy = async (children: ReactNode) => {
    const code = String(children).replace(/\n$/, '')
    const success = await copy(code)
    if (success) messageApi.success('copied!')
    else messageApi.error('failed to copy')
  }

  const cardBodyUI = (content: Message) => content.type === ContentTypes.TEXT ? (
    <ReactMarkdown
      children={content.message}
      components={{
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return  match ? (
            <div className={styles.CodeBlock}>
              <CopyOutlined onClick={() => handleCopy(children)} />
              {/* @ts-ignore */}
              <SyntaxHighlighter
                {...props}
                language={match[1]}
                style={dark}
              >
                {String(content.message).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
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

  return (
    <div
      style={{        
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
      className={styles.Container}
    >
      {contextHolder}
      <List
        className={styles.ListContainer}
        dataSource={messages}
        locale={{ emptyText: <div></div> }}
        renderItem={msg => (
          <div className={styles.ListItemContainer}>
            {isGenerating && msg.sender === 'model' && msg.id === currentMessageCreatingUid && (
              <div className={styles.LoaderContainer}>
                <CatLogoSpin />
              </div>
            )}
            {msg.sender === 'model' && msg.id !== currentMessageCreatingUid && (
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
    </div> )
}

export default Chat