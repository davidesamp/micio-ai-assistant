import { CopyOutlined } from '@ant-design/icons'
import { message as antdMessage } from 'antd'
import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp'
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp'
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css'
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker'
import git from 'react-syntax-highlighter/dist/esm/languages/prism/git'
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import html from 'react-syntax-highlighter/dist/esm/languages/prism/markup'
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby'
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss'
import shell from 'react-syntax-highlighter/dist/esm/languages/prism/shell-session'
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml'
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
    //Frontend Languages
    SyntaxHighlighter.registerLanguage('html', html)
    SyntaxHighlighter.registerLanguage('css', css)
    SyntaxHighlighter.registerLanguage('scss', scss)
    SyntaxHighlighter.registerLanguage('javascript', javascript)
    SyntaxHighlighter.registerLanguage('typescript', typescript)
    SyntaxHighlighter.registerLanguage('jsx', jsx)
    SyntaxHighlighter.registerLanguage('tsx', tsx)

    //Backend & General Purpose Languages
    SyntaxHighlighter.registerLanguage('python', python)
    SyntaxHighlighter.registerLanguage('java', java)
    SyntaxHighlighter.registerLanguage('csharp', csharp)
    SyntaxHighlighter.registerLanguage('cpp', cpp)
    SyntaxHighlighter.registerLanguage('go', go)
    SyntaxHighlighter.registerLanguage('ruby', ruby)
    SyntaxHighlighter.registerLanguage('php', php)

    //Scripting / DevOps / Markup
    SyntaxHighlighter.registerLanguage('bash', bash)
    SyntaxHighlighter.registerLanguage('shell', shell)
    SyntaxHighlighter.registerLanguage('json', json)
    SyntaxHighlighter.registerLanguage('yaml', yaml)
    SyntaxHighlighter.registerLanguage('docker', docker)
    SyntaxHighlighter.registerLanguage('git', git)
  }, [])


  const handleCopy = async (children: React.ReactNode) => {
    const code = String(children).replace(/\n$/, '')
    const success = await copy(code)
    success ? messageApi.success('Copied!') : messageApi.error('Failed to copy')
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
                  {/* @ts-expect-error */}
                <SyntaxHighlighter
                  {...props}
                  language={match[1]}
                  style={dark}
                >
                  {String(children).replace(/\n$/, '')}
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
