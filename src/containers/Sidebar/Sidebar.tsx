import {
  UserOutlined, PlusOutlined, LoadingOutlined, DeleteOutlined, MenuOutlined
} from '@ant-design/icons'
import { Button, Menu, MenuProps, Typography, Spin, Popconfirm } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { deleteDoc, doc } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from './Sidebar.module.scss'
import { iconsProviderMapping } from './iconsProviderMapping'
import { db } from '@/firebase/config'
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
      actions: { setChatUid, resetMessages, updateChatList, deleteChat }
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
  }, [loggedUser, updateChatList])

  type MenuItem = Required<MenuProps>['items'][number]

  const { Title } = Typography

  const handleDeleteChat = async (chatId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    try {
      const chatRef = doc(db, 'chats', chatId)
      await deleteDoc(chatRef)
      deleteChat(chatId)
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

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
      label: (
        <div className={styles.MenuItem}>
          <span>{label}</span>
          <Popconfirm
            title="Delete chat"
            description="Are you sure you want to delete this chat?"
            onConfirm={(e) => handleDeleteChat(key as string, e)}
            onCancel={(e) => e?.stopPropagation()}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined width="1rem" height="1rem" />}
              onClick={(e) => e.stopPropagation()}
              className={styles.DeleteButton}
            />
          </Popconfirm>
        </div>
      ),
    } as MenuItem
  }

  const items: MenuItem[] = Object.keys(chatList).map(key => getItem(
    chatList[key].messages[0].message, //The first message is the name of the chat
    key,
    iconsProviderMapping[chatList[key].model.provider]?.icon || <UserOutlined />,
  ))

  const handleNewChat = () => {
    console.log('New chat button clicked')
    const newChatUid = uuidv4()
    setChatUid(newChatUid)
    resetMessages()
  }

  const handleCollapse = () => {
    setCollapsed(!collapsed)
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

  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
  }


  return (
    <Sider 
      trigger={null} 
      style={siderStyle} 
      collapsible collapsed={collapsed} 
      width={300}
    >
      <div className="demo-logo-vertical" />
      <MenuOutlined className={styles.SidebarLogo} onClick={handleCollapse} />
      <div className={styles.SidebarHeader}>
        {!collapsed && (
          <Title level={5}>
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