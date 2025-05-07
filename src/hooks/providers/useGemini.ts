import { GoogleGenAI, Part } from '@google/genai'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Model } from '@/model/ai'
import { ContentTypes, Message, UploadedFile } from '@/model/chat'
import { useMicioStore } from '@/store'
import { GeminiModalitiesByModel } from '@/utils/restrictions'

const useGemini = () => {

  const {
  chat: {
    currentChat,
    actions: { setCurrentChat, resetMessages, setModel, newAddMessage }
  },
  user: {
    aiSettings,
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

  const changeModel = (model: Model, chatMessages: Message[]) => {
    let instance: GoogleGenAI | null = null
    if (!geminiInstance) {
      instance = init()
      console.log('Gemini instance initialized')
      setGeminiInstance(instance)
    } else {
      instance = geminiInstance
    }

    const { prompt, temperature } = aiSettings

    // const currentHistory = currentChat?.getHistory()
    const newChatSession = instance.chats.create({
      history: chatMessages.map((message) => ({
        role: message.sender === 'user' ? 'user' : 'model',
        content: message.message,
      })), 
      model: model.name,
      config: {
        systemInstruction: prompt,
        temperature,
        //@ts-expect-error type with existing model
        responseModalities: GeminiModalitiesByModel[model],
      },
    })
    setCurrentChat(newChatSession)
    setModel(model)
    resetMessages()
    console.log(`Model changed to ${model.name}`)
  }

  const generateContent = async (statement: string, uploadedFiles?: UploadedFile[]) => {
    if (!currentChat) {
      throw new Error('Current chat session is not initialized.')
    }

    const parts: Part[] = []

    if (uploadedFiles) {
      uploadedFiles.forEach((file) => {
        parts.push({
          inlineData: {
            mimeType: file.mimeType,
            data: file.data,
          },
        })
      })
     
    }

    if (statement) {
      parts.push({ text: statement })
    }

    const { prompt, temperature } = aiSettings

    const resultStream = await currentChat.sendMessageStream({
      message: parts,
      config: {
        temperature: temperature,
        systemInstruction: prompt,
      },
    })

    const textMessageId = uuidv4()
    const imageMessageId = uuidv4()

    for await (const chunk of resultStream) {
      const isLastChunk = chunk.candidates?.[0]?.finishReason !== undefined
      for (const part of chunk.candidates?.[0]?.content?.parts || []) {
        if (part.text) {
          const response: Message = {
            id: textMessageId,
            sender: 'model',
            message: part.text,
            type: ContentTypes.TEXT,
            isLastPart: isLastChunk
          }
          newAddMessage(response)
        } else if (part.inlineData) {
          const imageData = part.inlineData.data
          if (!imageData) {
            throw new Error('Image data is undefined.')
          }
          const responseImage: Message = {
            id: imageMessageId,
            sender: 'model',
            message: imageData,
            type: ContentTypes.IMAGE,
            isLastPart: isLastChunk
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
