import { Layout, theme } from 'antd'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useCallback, useEffect } from 'react'
import './App.scss'
import { ApiConfigModal } from './components/ApiConfigModal/ApiConfigModal'
import Chat from './containers/Chat/Chat'
import Sidebar from './containers/Sidebar/Sidebar'
import TopBar from './containers/TopBar/TopBar'
import { auth } from './firebase/config'
import useGenerateContent from './hooks/useGenerateContent'
import { AIProvider } from './model/ui'
import { useMicioStore } from './store'
import { getApisConfig } from './utils/localStorage'


const App = () => {
  const { Header, Content, Footer } = Layout
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const { changeModel } = useGenerateContent()

  const {
    user: {
      loggedUser,
      actions: { setUser },
    },
    chat: {
      apisConfig,
      actions: { setApisConfig },
    },
    ui: {
      configModalOpen,
      actions: { openConfigModal },
    },

  } = useMicioStore()

  const handleInitCasualModel = useCallback((config: Record<AIProvider, string>) => {
    if (config[AIProvider.GEMINI]) {
      changeModel({ name: 'gemini-2.0-flash', provider: AIProvider.GEMINI })
    } else if (config[AIProvider.MISTRAL]) {
      changeModel({ name: 'mistral-small-latest', provider: AIProvider.MISTRAL })
    } else if (config[AIProvider.DEEPSEEK]) {
      changeModel({ name: 'deepseek-chat', provider: AIProvider.DEEPSEEK })
    } else if (config[AIProvider.OPENAI]) {
      changeModel({ name: 'gpt-4', provider: AIProvider.DEEPSEEK })
    } 
  }, [])

  useEffect(() => {
    if (apisConfig) {
      handleInitCasualModel(apisConfig)
    }
  }, [apisConfig, handleInitCasualModel])

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if(user) setUser(user)
    })
  }, [setUser])

   useEffect(() => {
      const loadApis = async () => {
        try {
          if(loggedUser && !apisConfig) {
            const apisConfig = await getApisConfig()
            console.log('APIS CONFIG', apisConfig)
            if(apisConfig) setApisConfig(apisConfig)
            else openConfigModal()
          }
        } catch (error) {
          console.error('Error loading apis:', error)
        } finally {
          //TODO 
        }
      }
  
      loadApis()
   }, [loggedUser, apisConfig, setApisConfig, openConfigModal])
  

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header 
          style={{ padding: 0, background: colorBgContainer, position: 'sticky', top: 0, zIndex: 3 }} >
          <TopBar />
        </Header>
        <Content>
          {configModalOpen && <ApiConfigModal />}
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