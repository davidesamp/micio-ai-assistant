import { UserOutlined } from '@ant-design/icons'
import { Avatar, Popover } from 'antd'
import { User } from 'firebase/auth'
import React from 'react'
import styles from './UserThumbnail.module.scss'

interface UserThumbnailProps {
  user: User
  onApiKeysUpdate: () => void
  onLogout: () => void
}

export const UserThumbnail = ({ user, onApiKeysUpdate, onLogout }: UserThumbnailProps) => {
  const userPopoverContent = (
    <ul className={styles.UserPopoverContent}>
      <li onClick={onApiKeysUpdate}>API keys</li>
      <li onClick={onLogout}>Logout</li>
    </ul>
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
