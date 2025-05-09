import { PlusOutlined, SendOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useRef } from 'react'
import styles from './MicioTextarea.module.scss'

interface MicioTextareaProps {
  statement: string
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void
  onSend: () => void
  // eslint-disable-next-line no-unused-vars
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>
}

export const MicioTextarea = ({
  statement,
  textAreaRef,
  onChange,
  onSend,
  onFileChange,
}: MicioTextareaProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleLoadFile = () => {
    inputFileRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className={styles.Container}>
      <input
        accept="image/*"
        ref={inputFileRef}
        type="file"
        className={styles.FileInput}
        onChange={onFileChange}
      />
      <div className={styles.InputWrapper}>
        <Button
          className={`${styles.IconButton} ${styles.LeftButton}`}
          icon={<PlusOutlined />}
          onClick={handleLoadFile}
        />
        <TextArea
          ref={textAreaRef}
          className={styles.TextArea}
          value={statement}
          onChange={handleChange}
          onPressEnter={handleKeyDown}
          autoSize={{ minRows: 2, maxRows: 18 }}
          placeholder="Ask something ..."
        />
        <Button
          className={`${styles.IconButton} ${styles.RightButton}`}
          icon={<SendOutlined />}
          onClick={onSend}
        />
      </div>
    </div>
  )
}


