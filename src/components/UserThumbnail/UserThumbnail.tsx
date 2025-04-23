import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { User } from 'firebase/auth'
import React from 'react'
import styles from './UserThumbnail.module.scss'

interface UserThumbnailProps {
  user: User
}

export const UserThumbnail = ({ user }: UserThumbnailProps) => {
  return (
    <div className={styles.Container}>
      {user.photoURL ? (
        <img src={user.photoURL} alt="User Thumbnail" />
      ) : (
          <Avatar className={styles.DefaultAvatar} icon={<UserOutlined />} />
      )}
    </div>
  )
}
