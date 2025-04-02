import { LoadingOutlined } from '@ant-design/icons'
import { theme, Input, List, Card, Spin } from 'antd'
import { Typography } from 'antd'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import PlaceholderImage from '../../icons/micio-ai-pink.png'
import { useMicioStore } from '../../store'
import styles from './Chat.module.scss'
import ImageRenderer from '@/components/ImageRenderer/ImageRenderer'
import useGenerateContent from '@/hooks/useGenerateContent'
import { ContentTypes, Message } from '@/model/chat'

const { TextArea } = Input


const Chat = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
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

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()

      generate(statement)
      setStatement('')
    }
  }

  const cardBodyUI = (content: Message) => content.type === ContentTypes.TEXT ? (
    <ReactMarkdown>{content.message}</ReactMarkdown>
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
              <List.Item key={msg.id}>
                <Card variant="borderless" style={{ width: 1000 }}>
                  {cardBodyUI(msg)}
                </Card>
              </List.Item>
            )}
            locale={{ emptyText: <Title level={5}>No message yet</Title> }}
            style={{ marginBottom: 20 }}
          />
          {isGenerating && < Spin indicator={<LoadingOutlined spin />} size="large" />}
          <TextArea
            className={styles.TextArea}
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            onPressEnter={handleKeyDown}
            autoSize={{ minRows: 4, maxRows: 6 }} // Auto-expands but limits height
            placeholder="Ask something"
          />
    </div> ) : (
    <div className={styles.EmptyStateContainer}>
      <img src={PlaceholderImage} alt="Micio" />
      <Title level={3}>Select an AI provider on the Top Left to start chatting</Title>
    </div>
  )
}

export default Chat