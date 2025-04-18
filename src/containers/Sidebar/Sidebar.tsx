import {
  UserOutlined,
} from '@ant-design/icons'
import { Menu, MenuProps, Typography } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useState } from 'react'
import useGenerateContent from '@/hooks/useGenerateContent'
import { getChatHistory, getChatList } from '@/utils/localStorage'

const Sidebar = () => {
   const [collapsed, setCollapsed] = useState(false)

  const { restoreChat } = useGenerateContent()

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
    chats[key].messages[0].message, //The first message is the name of the chat
    key,
    <UserOutlined />,
  ))

  const handleSelect: MenuProps['onSelect'] = (info) => {
    console.log('Selected item info --> ', info)
    const selectedChat = getChatHistory(info.key)
    if (selectedChat) {
      console.log('Selected chat history --> ', selectedChat)
      const {
        messages,
        model
      } = selectedChat

      restoreChat(model, messages)
    }
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