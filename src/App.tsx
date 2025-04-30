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
import { ModelsList } from './utils/constants'
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
    const geminiDefault = ModelsList.find(model => model.name === 'gemini-2.0-flash')
    const mistralDefault = ModelsList.find(model => model.name === 'mistral-small-latest')
    const openAiDefault = ModelsList.find(model => model.name === 'gpt-4')
    const deepSeekDefault = ModelsList.find(model => model.name === 'deepseek-chat')
    if (config[AIProvider.GEMINI] && geminiDefault) {
      changeModel(geminiDefault)
    } else if (config[AIProvider.MISTRAL] && mistralDefault) {
      changeModel(mistralDefault)
    } else if (config[AIProvider.DEEPSEEK] && deepSeekDefault) {
      changeModel(deepSeekDefault)
    } else if (config[AIProvider.OPENAI] && openAiDefault) {
      changeModel(openAiDefault)
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