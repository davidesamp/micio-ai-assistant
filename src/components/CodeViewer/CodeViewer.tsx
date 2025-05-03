import { CopyOutlined } from '@ant-design/icons'
import { message as antdMessage } from 'antd'
import React, { ReactNode, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useCopyToClipboard } from 'usehooks-ts'
import styles from './CodeViewer.module.scss'

interface CodeViewerProps {
  message: string
}

export const CodeViewer = ({ message }: CodeViewerProps) => {
  const [messageApi, contextHolder] = antdMessage.useMessage()
  const [, copy] = useCopyToClipboard()

  useEffect(() => {
    SyntaxHighlighter.registerLanguage('jsx', jsx)
  }, [])

  const handleCopy = async (children: ReactNode) => {
    const code = String(children).replace(/\n$/, '')
    const success = await copy(code)
    if (success) messageApi.success('copied!')
    else messageApi.error('failed to copy')
  }

  return (
    <>
      {contextHolder}
      <ReactMarkdown
        children={message}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <div className={styles.CodeBlock}>
                <CopyOutlined onClick={() => handleCopy(children)} />
                {/* @ts-ignore */}
                <SyntaxHighlighter
                  {...props}
                  language={match[1]}
                  style={dark}
                >
                  {String(message).replace(/\n$/, '')}
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
    </>
  )
}
