import { theme, Input, List, Card } from 'antd'
import { Typography } from 'antd'
import cx from 'classnames'
import React, { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import PlaceholderImage from '../../icons/micio-ai-pink.png'
import { useMicioStore } from '../../store'
import styles from './Chat.module.scss'
import ImageRenderer from '@/components/ImageRenderer/ImageRenderer'
import useGenerateContent from '@/hooks/useGenerateContent'
import CatLogoSpin from '@/icons/cat-logo-spin.svg'
import CatLogo from '@/icons/cat-logo.svg'
import { ContentTypes, Message } from '@/model/chat'

const { TextArea } = Input


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

  const [statement, setStatement] = useState('')
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight
    }
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      generate(statement)
      setStatement('')
      scrollToBottom()
    }
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

  return currentAiProvider ? (
    <div
      style={{        
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
      className={styles.Container}
    >
          <List
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
                    {cardBodyUI(msg)}
                  </Card>
                </List.Item>
              </div>  
            
            )}
            style={{ marginBottom: 20 }}
          />
        
          <TextArea
            ref={textAreaRef}
            className={styles.TextArea}
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            onPressEnter={handleKeyDown}
            autoSize={{ minRows: 2, maxRows: 18 }} // Auto-expands but limits height
            placeholder="Ask something"
          />
    </div> ) : (
    <div className={styles.EmptyStateContainer}>
      <img src={PlaceholderImage} alt="Micio" />
      <Title level={3}>Select an AI provider to start chatting</Title>
    </div>
  )
}

export default Chat