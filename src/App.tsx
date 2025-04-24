import { Layout, theme } from 'antd'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useCallback, useEffect } from 'react'
import './App.scss'
import Chat from './containers/Chat/Chat'
import Sidebar from './containers/Sidebar/Sidebar'
import TopBar from './containers/TopBar/TopBar'
import { auth } from './firebase/config'
import useGenerateContent from './hooks/useGenerateContent'
import { AIProvider } from './model/ui'
import { useMicioStore } from './store'


const App = () => {
  const { Header, Content, Footer } = Layout
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const { changeModel } = useGenerateContent()

  const {
    user: {
      actions: { setUser },
    },
  } = useMicioStore()

  const handleInitCasualModel = useCallback(() => {
    if (process.env.GOOGLE_GEMINI_KEY) {
      changeModel({ name: 'gemini-2.0-flash', provider: AIProvider.GEMINI })
    } else if (process.env.MISTRAL_KEY) {
      changeModel({ name: 'mistral-small-latest', provider: AIProvider.MISTRAL })
    } else if (process.env.DEEPSEEK_KEY) {
      changeModel({ name: 'deepseek-chat', provider: AIProvider.DEEPSEEK })
    } 
  }, [])

  useEffect(() => {
    handleInitCasualModel()
  }, [handleInitCasualModel])

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if(user) setUser(user)
    })
  }, [setUser])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header 
          style={{ padding: 0, background: colorBgContainer, position: 'sticky', top: 0, zIndex: 3 }} >
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