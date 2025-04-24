import {
  UserOutlined, PlusOutlined, LoadingOutlined
} from '@ant-design/icons'
import { Button, Menu, MenuProps, Typography, Spin } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from './Sidebar.module.scss'
import useGenerateContent from '@/hooks/useGenerateContent'
import { useMicioStore } from '@/store'
import { getChatHistory, getChatList } from '@/utils/localStorage'

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading] = useState(true)

  const { restoreChat } = useGenerateContent()
  const {
    chat: {
      chatList,
      actions: { setChatUid, resetMessages, updateChatList }
    },
    user: {
      loggedUser
    }
  } = useMicioStore()

  useEffect(() => {
    const loadChats = async () => {
      try {
        if(loggedUser) {
          const chatList = await getChatList()
          Object.values(chatList).forEach(chat => {
            updateChatList(chat)
          })
        }
      } catch (error) {
        console.error('Error loading chats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadChats()
  }, [loggedUser])

  type MenuItem = Required<MenuProps>['items'][number]

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

  const items: MenuItem[] = Object.keys(chatList).map(key => getItem(
    chatList[key].messages[0].message, //The first message is the name of the chat
    key,
    <UserOutlined />,
  ))

  const handleNewChat = () => {
    console.log('New chat button clicked')
    const newChatUid = uuidv4()
    setChatUid(newChatUid)
    resetMessages()
  }

  const handleSelect: MenuProps['onSelect'] = async (info) => {
    console.log('Selected item info --> ', info)
    try {
      const selectedChat = await getChatHistory(info.key)
      if (selectedChat) {
        console.log('Selected chat history --> ', selectedChat)
        const {
          messages,
          model,
          uuid
        } = selectedChat

        restoreChat(model, messages, uuid)
      }
    } catch (error) {
      console.error('Error loading chat:', error)
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
      {loading ? (
        <div className={styles.LoadingContainer}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        <Menu 
          className={styles.Menu} 
          onSelect={handleSelect} 
          theme="dark" 
          defaultSelectedKeys={['1']} 
          mode="inline" 
          items={items} 
        />
      )}
    </Sider>
  )
}

export default Sidebar