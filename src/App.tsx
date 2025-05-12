import { Layout, Spin, theme } from 'antd'
import { notification } from 'antd'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useCallback, useEffect } from 'react'
import styles from './App.module.scss'
import { ApiConfigModal } from './components/ApiConfigModal/ApiConfigModal'
import { SettingsModal } from './components/SettingsModal/SettingsModal'
import Chat from './containers/Chat/Chat'
import Sidebar from './containers/Sidebar/Sidebar'
import TopBar from './containers/TopBar/TopBar'
import { auth } from './firebase/config'
import useGenerateContent from './hooks/useGenerateContent'
import { AIProvider } from './model/ui'
import { getApisConfig } from './services/dataMiddleware'
import { useMicioStore } from './store'
import { ModelsList } from './utils/constants'


const App = () => {
  const { Header, Content, Footer } = Layout
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const [checkedUser, setCheckedUser] = React.useState(false)

  const { changeModel } = useGenerateContent()

  const [api, contextHolder] = notification.useNotification()

  const {
    user: {
      actions: { setUser },
    },
    chat: {
      apisConfig,
      actions: { setApisConfig },
    },
    ui: {
      configModalOpen, settingsModalOpen, notification: micionotification,
      actions: { openConfigModal, clearNotification, setNotification },
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
    if (micionotification) {
      const options = {
        message: micionotification.title,
        description: micionotification.description,
        placement: 'bottomLeft' as const,
        duration: 3,
        onClick: () => {
          api.destroy()
          clearNotification()
        },
        onClose: () => {
          api.destroy()
          clearNotification()
        },
      }
      if (micionotification.type === 'success') {
        api.success(options)
      } else if (micionotification.type === 'error') {
        api.error(options)
      } else if (micionotification.type === 'info') {
        api.info(options)
      } else if (micionotification.type === 'warning') {
        api.warning(options)
      }
    }
  }, [api, clearNotification, micionotification])

  useEffect(() => {
    if (apisConfig) {
      handleInitCasualModel(apisConfig)
    }
  }, [apisConfig, handleInitCasualModel])

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if(user) {
        setUser(user)
        
      }
      setCheckedUser(true)
    }, (error) => {
      setCheckedUser(true)
      setNotification({
        type: 'error',
        title: 'Error loading user',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  )
  }, [setNotification, setUser])

   useEffect(() => {
      const loadApis = async () => {
        try {
          if(checkedUser && !apisConfig) {
            const apisConfig = await getApisConfig()
            console.log('APIS CONFIG', apisConfig)
            if(apisConfig) setApisConfig(apisConfig)
            else openConfigModal()
          }
        } catch (error) {
          setNotification({
            type: 'error',
            title: 'Error loading apis',
            description: error instanceof Error ? error.message : 'An unknown error occurred',
          })
        } finally {
          //TODO 
        }
      }
  
      loadApis()
   }, [checkedUser, apisConfig, setApisConfig, openConfigModal, setNotification])
  

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {contextHolder}
      <Sidebar />
      <Layout>
        <Header 
          style={{ padding: 0, background: colorBgContainer, position: 'sticky', top: 0, zIndex: 3 }} >
          <TopBar />
        </Header>
        <Content>
          {configModalOpen && <ApiConfigModal />}
          {settingsModalOpen && <SettingsModal />}
          {!checkedUser && <Spin className={styles.Spin} size="large" />}
          <Chat/>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Micio AI ©{new Date().getFullYear()} Created by davidesamp
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App