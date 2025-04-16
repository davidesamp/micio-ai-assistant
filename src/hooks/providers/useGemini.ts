import { GoogleGenAI } from '@google/genai'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Model } from '@/model/ai'
import { ContentTypes, Message } from '@/model/chat'
import { useMicioStore } from '@/store'
import { GeminiModalitiesByModel } from '@/utils/restrictions'

const useGemini = () => {

  const {
  chat: {
    currentChat,
    actions: { setCurrentChat, resetMessages, setModel, newAddMessage }
  }
  } = useMicioStore()

  const [geminiInstance, setGeminiInstance] = useState<GoogleGenAI | null>(null)

  const init = () =>  {
    const googleGeminiKey = process.env.GOOGLE_GEMINI_KEY
    if (!googleGeminiKey) {
      throw new Error('GOOGLE_GEMINI_KEY environment variable is not set.')
    }
    const genAI = new GoogleGenAI({ apiKey: googleGeminiKey })

    return genAI
  }

  const changeModel = (model: Model) => {
    let instance: GoogleGenAI | null = null
    if (!geminiInstance) {
      instance = init()
      console.log('Gemini instance initialized')
      setGeminiInstance(instance)
    } else {
      instance = geminiInstance
    }

    // const currentHistory = currentChat?.getHistory()
    const newChatSession = instance.chats.create({
      history: [], 
      model: model.name,
      config: {
        //@ts-expect-error type with existing model
        responseModalities: GeminiModalitiesByModel[model],
      },
    })
    setCurrentChat(newChatSession)
    setModel(model)
    resetMessages()
    console.log(`Model changed to ${model.name}`)
  }

  const generateContent = async (statement: string) => {
    if (!currentChat) {
      throw new Error('Current chat session is not initialized.')
    }

    const resultStream = await currentChat.sendMessageStream({
      message: statement
    })

    const textMessageId = uuidv4()
    const imageMessageId = uuidv4()

    for await (const chunk of resultStream) {
      for (const part of chunk.candidates?.[0]?.content?.parts || []) {
        if (part.text) {
          const response: Message = {
            id: textMessageId,
            sender: 'user',
            message: part.text,
            type: ContentTypes.TEXT,
          }
          newAddMessage(response)
        } else if (part.inlineData) {
          const imageData = part.inlineData.data
          if (!imageData) {
            throw new Error('Image data is undefined.')
          }
          const responseImage: Message = {
            id: imageMessageId,
            sender: 'user',
            message: imageData,
            type: ContentTypes.IMAGE,
          }
          newAddMessage(responseImage)
        }
      }
    }
  }

  return {
    generateContent,
    changeModel
  }
}

export default useGemini
