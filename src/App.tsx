import { Layout, theme } from 'antd'
import React, { useCallback, useEffect } from 'react'
import './App.scss'
import Chat from './containers/Chat/Chat'
import Sidebar from './containers/Sidebar/Sidebar'
import TopBar from './containers/TopBar/TopBar'
import useGenerateContent from './hooks/useGenerateContent'
import { AIProvider } from './model/ui'

const App = () => {
  const { Header, Content, Footer } = Layout
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const { changeModel } = useGenerateContent()

  const handleInitCasualModel = useCallback(() => {
    if (process.env.GOOGLE_GEMINI_KEY) {
      changeModel({ name: 'gemini-2.0-flash-exp-image-generation', provider: AIProvider.GEMINI })
    } else if (process.env.MISTRAL_KEY) {
      changeModel({ name: 'mistral-small-latest', provider: AIProvider.MISTRAL })
    } else if (process.env.DEEPSEEK_KEY) {
      changeModel({ name: 'deepseek-chat', provider: AIProvider.DEEPSEEK })
    } 
  }, [])

  useEffect(() => {
    handleInitCasualModel()
  }, [handleInitCasualModel])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} >
          <TopBar />
        </Header>
        <Content>
          <Chat />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Micio AI ©{new Date().getFullYear()} Created by davidesamp
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App