import { ConfigProvider } from 'antd'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/custom-antd-theme.css'

const container = document.getElementById('app')
 
const root = createRoot(container!)
root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#D11141', // Dark Pink (Primary)
        colorBgBase: '#000000', // Black (Background)
        colorText: '#FFFFFF', // White (Primary Text)
        colorTextSecondary: 'rgba(255, 255, 255, 0.75)', // Slightly transparent white for secondary text.
        colorBorder: 'rgba(255, 255, 255, 0.2)', // Light white border
        colorLink: '#D11141', // Dark pink for links
        colorLinkHover: '#E54065', // Lighter pink on hover
        colorLinkActive: '#B80032', // Darker pink when active
        colorBgContainer: '#121212', // Slightly lighter black for containers
        colorBgElevated: '#1A1A1A', // Even lighter black for elevated elements
        colorFillSecondary: 'rgba(255, 255, 255, 0.1)', // Subtle white fill for secondary elements
        colorFillTertiary: 'rgba(255, 255, 255, 0.05)', // Even subtler white fill
        colorBorderSecondary: 'rgba(255, 255, 255, 0.15)', // Slightly lighter white border
        colorBgMask: 'rgba(0, 0, 0, 0.65)', // Mask background with transparency
        colorSuccess: '#52c41a', // Keep default success (or customize)
        colorWarning: '#faad14', // Keep default warning (or customize)
        colorError: '#f5222d', // Keep default error (or customize)
      },
    }}
  > 
  <App />
</ConfigProvider>
)

