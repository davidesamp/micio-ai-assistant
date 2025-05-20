import { theme, Typography } from 'antd'
import React from 'react'
import styles from './Footer.module.scss'
import { getPublicUrl } from '@/utils/utils'

export const Footer = () => {
  const { Link } = Typography
  const {
    token: { colorPrimary, colorText },
  } = theme.useToken()
  return (
    <div className={styles.Container}>
      <div>
        Micio AI ©{new Date().getFullYear()} Created by{' '}
        <Link target='_blank' style={{ color: colorPrimary }} href='https://github.com/davidesamp'>davidesamp</Link>
      </div>
      <div className={styles.ComplaintsContainer}>
        <Link style={{ color: colorText }} rel="noopener noreferrer" target='_blank' href={getPublicUrl('privacy-policy.html')}>
          Privacy Policy
        </Link>
        <span>|</span>
        <Link style={{ color: colorText }} rel="noopener noreferrer" target='_blank' href={getPublicUrl('terms-of-service.html')}>
          Terms of Service
        </Link>
      </div>
    </div>
  )
}
