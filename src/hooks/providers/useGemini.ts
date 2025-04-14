import { GoogleGenAI } from '@google/genai'
import { useState } from 'react'
import { Model } from '@/model/ai'
import { ContentTypes, GeneratedContent } from '@/model/chat'
import { useMicioStore } from '@/store'
import { GeminiModalitiesByModel } from '@/utils/restrictions'

const useGemini = () => {

  const {
  chat: {
    currentChat,
    actions: { setCurrentChat, resetMessages, setModel }
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


  const generateContent = async (statement: string): Promise<GeneratedContent[]> => {
    if(!currentChat) {
      throw new Error('Current chat session is not initialized.')
    }

    const response = await currentChat.sendMessage({
      message: statement
    })

    let generatedContents: GeneratedContent[] = []
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        generatedContents.push({ content: part.text, type: ContentTypes.TEXT })
      } else if (part.inlineData) {
        const imageData = part.inlineData.data
        if (!imageData) {
          throw new Error('Image data is undefined.')
        }
        generatedContents.push({ content: imageData, type: ContentTypes.IMAGE })
      }
    }

    return generatedContents
  }

  return {
    generateContent,
    changeModel
  }
}

export default useGemini
