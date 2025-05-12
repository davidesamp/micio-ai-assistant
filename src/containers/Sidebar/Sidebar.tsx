import {
  UserOutlined, PlusOutlined, LoadingOutlined, DeleteOutlined, MenuOutlined
} from '@ant-design/icons'
import { Button, Menu, MenuProps, Typography, Spin, Popconfirm } from 'antd'
import Sider from 'antd/es/layout/Sider'
import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from './Sidebar.module.scss'
import { iconsProviderMapping } from './iconsProviderMapping'
import useGenerateContent from '@/hooks/useGenerateContent'
import { getChatHistory, getChatList } from '@/services/dataMiddleware'
import { deleteChat as deleteChatService } from '@/services/dataMiddleware'
import { useMicioStore } from '@/store'

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
    },
    ui: {
      actions: { setNotification }
    },
  } = useMicioStore()

  useEffect(() => {
    const loadChats = async () => {
      try {
        const chatList = await getChatList()
        Object.values(chatList).forEach(chat => {
          updateChatList(chat)
        })
      } catch (error) {
        setNotification({
          type: 'error',
          title: 'Error loading chats',
          description: error instanceof Error ? error.message : 'An unknown error occurred',
        })
      } finally {
        setLoading(false)
      }
    }

    loadChats()
  }, [loggedUser, setNotification, updateChatList])

  type MenuItem = Required<MenuProps>['items'][number]

  const { Title } = Typography

  const handleDeleteChat = async (chatId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    try {
      deleteChatService(chatId)
      deleteChat(chatId)
      setNotification({
        type: 'success',
        title: 'Chat deleted',
        description: 'The chat has been deleted successfully.',
      })
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Error deleting chats',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
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
          <span className={styles.Label}>{label}</span>
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

  const items: MenuItem[] = Object.keys(chatList)
    .sort((a, b) => chatList[b].createdAt - chatList[a].createdAt) // Sort by createdAt descending
    .map(key => getItem(
      chatList[key].messages[0].message, // The first message is the name of the chat
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
        const {
          messages,
          model,
          uuid
        } = selectedChat

        restoreChat(model, messages, uuid)
      }
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Error loading chats',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      })
    }
  }

  const siderStyle: React.CSSProperties = {
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