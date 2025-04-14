import { Menu, MenuProps, Typography } from 'antd'
import Sider from 'antd/es/layout/Sider'
import {
  UserOutlined,
} from '@ant-design/icons'
import React, { useState } from 'react'
import { getChatList } from '@/utils/localStorage'

const Sidebar = () => {
   const [collapsed, setCollapsed] = useState(false)

   type MenuItem = Required<MenuProps>['items'][number];

  const { Title } = Typography

  const getItem =(
     label: React.ReactNode,
     key: React.Key,
     icon?: React.ReactNode,
     children?: MenuItem[],
   ): MenuItem => {
     return {
       key,
       icon,
       children,
       label,
     } as MenuItem
   }

  
  const chats = getChatList() 

  const items: MenuItem[] = Object.keys(chats).map(key => getItem(
    chats[key][0],
    key,
    <UserOutlined />,
  ))

  const handleSelect: MenuProps['onSelect'] = (info) => {
    console.log('Selected item info --> ', info)
  }

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div className="demo-logo-vertical" />
      <Title level={3}>
        Your Chat List  
      </Title> 
      <Menu onSelect={handleSelect} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
    </Sider>
  )
}

export default Sidebar