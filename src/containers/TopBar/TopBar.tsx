import {
  SettingOutlined,
} from '@ant-design/icons'
import { Button, Popover } from 'antd'
import { Typography } from 'antd'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import React from 'react'
import { iconsProviderMapping } from '../Sidebar/iconsProviderMapping'
import styles from './TopBar.module.scss'
import { ModelsPopover } from '@/components/ModelsPopover/ModelsPopover'
import { UserThumbnail } from '@/components/UserThumbnail/UserThumbnail'
import { useMicioStore } from '@/store'


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

  const { Title } = Typography

  const auth = getAuth()
  const provider = new GoogleAuthProvider()

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

  return (
    <div className={styles.Container}>
     
      {currentAiProvider && (
        <Popover 
          placement="bottomLeft" 
          content={<ModelsPopover />} 
          trigger="click" 
          showArrow={false}>
          <div className={styles.SettingsContainer}>
            <SettingOutlined className={styles.SettingsIcon} />
            <Title level={5} className={styles.ProviderTitle}>
              {selectedModel?.displayName || 'Select a model'}
            </Title>
            {selectedModel && iconsProviderMapping[selectedModel.provider]?.icon}
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