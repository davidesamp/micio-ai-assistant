import { UserOutlined } from '@ant-design/icons'
import { Avatar, Popover, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { User } from 'firebase/auth'
import React from 'react'
import styles from './UserThumbnail.module.scss'

interface UserThumbnailProps {
  user: User
  onApiKeysUpdate: () => void
  onSettingsOpen: () => void
  onLogout: () => void
}

export const UserThumbnail = ({ user, onApiKeysUpdate, onSettingsOpen, onLogout }: UserThumbnailProps) => {
  const menuItems: MenuProps['items'] = [
    {
      key: 'Settings',
      label: 'Settings',
      onClick: onSettingsOpen,
    },
    {
      key: 'api-keys',
      label: 'API Keys',
      onClick: onApiKeysUpdate,
    },
    {
      key: 'logout',
      label: 'Logout',
      onClick: onLogout,
    },
  ]

  const userPopoverContent = (
    <Menu items={menuItems} className={styles.Menu} />
  )

  return (
    <Popover placement="bottom" content={userPopoverContent} trigger="click" showArrow={false}>
      <div className={styles.Container}>
        {user.photoURL ? (
          <img src={user.photoURL} alt="User Thumbnail" />
        ) : (
          <Avatar className={styles.DefaultAvatar} icon={<UserOutlined />} />
        )}
      </div>
    </Popover>
  )
}
export default UserThumbnail