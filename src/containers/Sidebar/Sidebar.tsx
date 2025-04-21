import {
  UserOutlined, PlusOutlined
} from '@ant-design/icons'
import { Button, Menu, MenuProps, Typography } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from './Sidebar.module.scss'
import useGenerateContent from '@/hooks/useGenerateContent'
import { useMicioStore } from '@/store'
import { getChatHistory, getChatList } from '@/utils/localStorage'


const Sidebar = () => {
   const [collapsed, setCollapsed] = useState(false)

  const { restoreChat } = useGenerateContent()
  const {
    chat: {
      actions: { setChatUid, resetMessages }
    },
  } = useMicioStore()

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

  const handleNewChat = () => {
    console.log('New chat button clicked')
    const newChatUid = uuidv4()
    setChatUid(newChatUid)
    resetMessages()
  }

  const handleSelect: MenuProps['onSelect'] = (info) => {
    console.log('Selected item info --> ', info)
    const selectedChat = getChatHistory(info.key)
    if (selectedChat) {
      console.log('Selected chat history --> ', selectedChat)
      const {
        messages,
        model,
        uuid
      } = selectedChat

      restoreChat(model, messages, uuid)
    }
  }

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div className="demo-logo-vertical" />
      <div className={styles.SidebarHeader}>
        {!collapsed && (
          <Title level={4}>
            Your Chat List
          </Title>
        )}
       
        <Button className={styles.NewChatBtn} onClick={handleNewChat}>
          <PlusOutlined />
          {!collapsed && (
            <span>New Chat</span> 
          )}
          
        </Button>
      </div>
      <Menu className={styles.Menu} onSelect={handleSelect} theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
    </Sider>
  )
}

export default Sidebar