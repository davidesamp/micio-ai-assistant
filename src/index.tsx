import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/custom-antd-theme.css'

const container = document.getElementById('app')

const root = createRoot(container!)
root.render(
  <App />
)

