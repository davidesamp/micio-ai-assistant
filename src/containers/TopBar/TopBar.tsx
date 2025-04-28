import {
  SettingOutlined,
} from '@ant-design/icons'
import { Button, Popover } from 'antd'
import { Typography } from 'antd'
import cx from 'classnames'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import React from 'react'
import styles from './TopBar.module.scss'
import { UserThumbnail } from '@/components/UserThumbnail/UserThumbnail'
import useGenerateContent from '@/hooks/useGenerateContent'
import { AIProvider } from '@/model/ui'
import { useMicioStore } from '@/store'
import {  ModelsList } from '@/utils/constants'


const TopBar = () => {
  const {
    chat: {
      selectedModel,
    },
    user: {
      loggedUser
    },
    global: {
      actions: { resetStore }
    },
    ui: { 
      currentAiProvider,
      actions: { openConfigModal}
    },
  } = useMicioStore()

  const { changeModel } = useGenerateContent()

  const { Title } = Typography

  const auth = getAuth()
  const provider = new GoogleAuthProvider()

  const getModelsListByProvider = (provider: AIProvider) => {
    const models = ModelsList.filter((model) => model.provider === provider)
    return models.map((model) => (
      <p 
        onClick={() => changeModel(model)} 
        className={cx(styles.PopoverItem, {[styles.Selected]: selectedModel?.name === model.name})} 
        key={model.name}>
          {model.name}
      </p>
    ))
  }

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('User signed in:', user)
    } catch (error) {
      console.error('Sign-in error:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      resetStore()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleOpenConfigModal = () => {
    openConfigModal()
  }

  const popoverContent = (
    <div className={styles.PopoverContent}>
      <Title level={4}>Gemini</Title>
      <div>
        {getModelsListByProvider(AIProvider.GEMINI)}
      </div>
      <Title level={4}>OpenAI</Title>
      <div>
        {getModelsListByProvider(AIProvider.OPENAI)}
      </div>
      <Title level={4}>DeepSeek</Title>
      <div>
        {getModelsListByProvider(AIProvider.DEEPSEEK)}
      </div>
      <Title level={4}>Mistral</Title>
      <div>
        {getModelsListByProvider(AIProvider.MISTRAL)}
      </div>
    </div>
  )

  return (
    <div className={styles.Container}>
     
      {currentAiProvider && (
        <Popover placement="bottomLeft" content={popoverContent} trigger="click" showArrow={false}>
          <div className={styles.SettingsContainer}>
            <div>
              <SettingOutlined />
            </div>
            <Title level={5} className={styles.ProviderTitle}>
              {selectedModel?.name || 'Select a model'}
            </Title>
          </div>
        </Popover>
      )}
      <div className={styles.Right}>
        {!loggedUser && (
          <Button onClick={handleSignIn}>Sign in</Button>
        )}
        {loggedUser && (
          <UserThumbnail 
            onApiKeysUpdate={handleOpenConfigModal}
            onLogout={handleSignOut}
            user={loggedUser} 
          />
        )}
      </div>
     
    </div>
  )
}

export default TopBar