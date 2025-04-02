import React, { useState } from 'react'
import {
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd'
import './App.scss'
import type { MenuProps } from 'antd'
import Chat from './containers/Chat/Chat'
import TopBar from './containers/TopBar/TopBar'
import useGenerateContent from './hooks/useGenerateContent'
import { AIProvider } from './model/ui'

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Sample Chat', '1', <PieChartOutlined />),
  getItem('Sample Chat with childs', 'sub1', <UserOutlined />, [
    getItem('child 1', '3'),
    getItem('child 2', '4'),
    getItem('child 3', '5'),
  ]),
]


const App = () => {
  const { Header, Content, Footer, Sider } = Layout
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const { initAIProvider } = useGenerateContent()

  const handleProviderChange = (provider: AIProvider) => {
    initAIProvider(provider)
  }

  

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} >
          <TopBar onProviderChange={handleProviderChange} />
        </Header>
        <Content>
          <Chat />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Micio AI ©{new Date().getFullYear()} Created by davidesamp
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App