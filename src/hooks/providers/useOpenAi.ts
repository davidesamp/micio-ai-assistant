import OpenAI from 'openai'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Model } from '@/model/ai'
import { ContentTypes, Message, UploadedFile } from '@/model/chat'
import { useMicioStore } from '@/store'

const useOpenAi = () => {
  const {
    chat: {
      selectedModel, messages,
      actions: { setModel, newAddMessage }
    }
  } = useMicioStore()

  const [openAiInstance, setOpenAiInstance] = useState<OpenAI | null>(null)

  const init = () => {
    const openAiKey = process.env.OPEN_AI_KEY
    if (!openAiKey) {
      throw new Error('OPENAI_KEY environment variable is not set.')
    }
    const openai = new OpenAI({
      apiKey: openAiKey,
      dangerouslyAllowBrowser: true
    })
    return openai
  }

  const changeModel = (model: Model) => {
    setModel(model)
    console.log(`OpenAI Model changed to ${model.name}`)
  }

  const generateContent = async (statement: string, uploadedFiles?: UploadedFile[]) => {
    let instance: OpenAI | null = null

    if (!openAiInstance) {
      instance = init()
      console.log('OpenAI instance initialized')
      setOpenAiInstance(instance)
    } else {
      instance = openAiInstance
    }

    if (!selectedModel) {
      throw new Error('OpenAI model is not set.')
    }

    const textMessageId = uuidv4()
    const chatHistory = messages.map((message) => ({
      role: message.sender === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
      content: message.message,
    }))

    const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = []

    if (uploadedFiles) {
      uploadedFiles.forEach((file) => {
        content.push({
          type: 'image_url',
          image_url: {
            url: `data:${file.mimeType};base64,${file.data}`
          }
        })
      })
    }

    if (statement) {
      content.push({
        type: 'text',
        text: statement
      })
    }

    const completion = await instance.chat.completions.create({
      messages: [
        { role: 'system' as 'system', content: `You are a helpful assistant and today is ${new Date()}` },
        ...chatHistory,
        { role: 'user', content },
      ],
      model: selectedModel.name,
      stream: true,
    })

    for await (const chunk of completion) {
      const token = chunk.choices[0]?.delta?.content || ''
      const response: Message = {
        id: textMessageId,
        sender: 'model',
        message: token,
        type: ContentTypes.TEXT,
      }
      newAddMessage(response)
    }
  }

  return {
    generateContent,
    changeModel,
  }
}

export default useOpenAi 