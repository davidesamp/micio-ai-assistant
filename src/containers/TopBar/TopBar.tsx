import {
  SwapOutlined,
} from '@ant-design/icons'
import { Button, Popover, theme } from 'antd'
import { Typography } from 'antd'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import React from 'react'
import { iconsProviderMapping } from '../Sidebar/iconsProviderMapping'
import styles from './TopBar.module.scss'
import { ModelsPopover } from '@/components/ModelsPopover/ModelsPopover'
import { UserThumbnail } from '@/components/UserThumbnail/UserThumbnail'
import GoogleIcon from '@/icons/google.svg'
import { transferChats } from '@/services/dataMiddleware'
import { useMicioStore } from '@/store'


interface TopBarProps {
  checkedUser: boolean
}

const TopBar = ({ checkedUser }: TopBarProps) => {
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

  const {
    token: { colorFillSecondary },
  } = theme.useToken()

  const [popoverOpen, setPopoverOpen] = React.useState(false)

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

  const handleOpenChange = (open: boolean) => {
    setPopoverOpen(open)
  }


  return (
    <div className={styles.Container} style={{ backgroundColor: colorFillSecondary }}>
      {currentAiProvider && apisConfig && (
        <Popover 
          onOpenChange={handleOpenChange}
          open={popoverOpen}
          placement="bottomLeft" 
          content={<ModelsPopover activeApisConfig={apisConfig} onModelSelected={() => handleOpenChange(false)}/>} 
          trigger="click" 
          showArrow={false}>
          <div className={styles.SettingsContainer}>
            <SwapOutlined  className={styles.SettingsIcon} />
            <Title level={5} className={styles.ProviderTitle}>
              {selectedModel?.displayName || 'Select a model'}
            </Title>
            <div className={styles.ProviderIcon}>
              {selectedModel && iconsProviderMapping[selectedModel.provider]?.icon}
            </div>
          </div>
        </Popover>
      )}
      <div className={styles.Right}>
        {!loggedUser && checkedUser && (
            <Button 
              onClick={handleSignIn} 
              type="primary" 
              className={styles.GoogleSignInButton}
            >
            <GoogleIcon />
            <span>
              Sign in with Google
            </span>
            </Button>
        )}
        <UserThumbnail 
          onSettingsOpen={openSettingsModal}
          onApiKeysUpdate={handleOpenConfigModal}
          onLogout={handleSignOut}
          user={loggedUser} 
        />
      </div>
     
    </div>
  )
}

export default TopBar