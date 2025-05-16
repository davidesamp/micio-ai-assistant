import { ConfigProvider, Layout, Spin, theme } from 'antd'
import { notification } from 'antd'
import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect } from 'react'
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
import { darkTheme, lightTheme } from './styles/themes'
import { ModelsList } from './utils/constants'


const App = () => {
  const { Header, Content, Footer } = Layout
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const {
    ui: {
      currentTheme
    }
  } = useMicioStore()

  const [checkedUser, setCheckedUser] = React.useState(false)

  const { changeModel } = useGenerateContent()

  const [api, contextHolder] = notification.useNotification()

  const setTheme = currentTheme === 'light' ? lightTheme : darkTheme

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

  useEffect(() => {
    if (apisConfig) {
      const geminiDefault = ModelsList.find(model => model.name === 'gemini-2.0-flash')
      const mistralDefault = ModelsList.find(model => model.name === 'mistral-small-latest')
      const openAiDefault = ModelsList.find(model => model.name === 'gpt-4')
      const deepSeekDefault = ModelsList.find(model => model.name === 'deepseek-chat')
      if (apisConfig[AIProvider.GEMINI] && geminiDefault) {
        changeModel(geminiDefault)
      } else if (apisConfig[AIProvider.MISTRAL] && mistralDefault) {
        changeModel(mistralDefault)
      } else if (apisConfig[AIProvider.DEEPSEEK] && deepSeekDefault) {
        changeModel(deepSeekDefault)
      } else if (apisConfig[AIProvider.OPENAI] && openAiDefault) {
        changeModel(openAiDefault)
      } 
    }
  }, [apisConfig])

  useEffect(() => {
    if (micionotification) {
      const options = {
        message: micionotification.title,
        description: micionotification.description,
        placement: 'bottomLeft' as const,
        duration: micionotification.type === 'error' ?  6: 3,
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
            if(apisConfig) {
              setApisConfig(apisConfig, false)
            }
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
    <ConfigProvider
        theme={setTheme}
      > 
      <Layout style={{ minHeight: '100vh' }}>
        {contextHolder}
        <Sidebar />
        <Layout>
          <Header 
            style={{ padding: 0, background: colorBgContainer, position: 'sticky', top: 0, zIndex: 3 }} >
            <TopBar checkedUser={checkedUser} />
          </Header>
          <Content>
            {configModalOpen && <ApiConfigModal />}
            {settingsModalOpen && <SettingsModal />}
            {!checkedUser && (
              <div className={styles.SpinContainer}>
                <Spin size="large" />
              </div>
            )}
            <Chat/>
          </Content>
            <Footer style={{ textAlign: 'center' }}>
            Micio AI ©{new Date().getFullYear()} Created by{' '}
            <a href="https://github.com/davidesamp" target="_blank" rel="noopener noreferrer">
              davidesamp
            </a>
            </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default App