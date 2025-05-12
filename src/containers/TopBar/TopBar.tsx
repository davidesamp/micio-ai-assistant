import {
  BulbOutlined,
} from '@ant-design/icons'
import { Button, Popover } from 'antd'
import { Typography } from 'antd'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import React from 'react'
import { iconsProviderMapping } from '../Sidebar/iconsProviderMapping'
import styles from './TopBar.module.scss'
import { ModelsPopover } from '@/components/ModelsPopover/ModelsPopover'
import { UserThumbnail } from '@/components/UserThumbnail/UserThumbnail'
import { transferChats } from '@/services/dataMiddleware'
import { useMicioStore } from '@/store'


const TopBar = () => {
  const {
    chat: {
      selectedModel,
      apisConfig,
    },
    user: {
      loggedUser,
    },
    global: {
      actions: { resetStore }
    },
    ui: { 
      currentAiProvider,
      actions: { openConfigModal, openSettingsModal, setNotification }
    },
  } = useMicioStore()

  const { Title } = Typography

  const auth = getAuth()
  const provider = new GoogleAuthProvider()

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('User signed in:', user)
      transferChats()
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Error signing in',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      resetStore()
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Error signing in',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  }

  const handleOpenConfigModal = () => {
    openConfigModal()
  }

  return (
    <div className={styles.Container}>
      {currentAiProvider && apisConfig && (
        <Popover 
          placement="bottomLeft" 
          content={<ModelsPopover activeApisConfig={apisConfig}/>} 
          trigger="click" 
          showArrow={false}>
          <div className={styles.SettingsContainer}>
            <BulbOutlined className={styles.SettingsIcon} />
            <Title level={5} className={styles.ProviderTitle}>
              {selectedModel?.displayName || 'Select a model'}
            </Title>
            {selectedModel && iconsProviderMapping[selectedModel.provider]?.icon}
          </div>
        </Popover>
      )}
      <div className={styles.Right}>
        {!loggedUser && (
            <Button 
              onClick={handleSignIn} 
              type="primary" 
              className={styles.GoogleSignInButton}
            >
              Sign in with Google
            </Button>
        )}
        {loggedUser && (
          <UserThumbnail 
            onSettingsOpen={openSettingsModal}
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