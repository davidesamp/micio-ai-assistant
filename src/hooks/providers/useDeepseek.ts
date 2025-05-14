import OpenAI from 'openai'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Model } from '@/model/ai'
import { ContentTypes, Message, UploadedFile } from '@/model/chat'
import { AIProvider } from '@/model/ui'
import { useMicioStore } from '@/store'

const useDeepSeek = () => {

  const {
    chat: {
      selectedModel, messages, apisConfig,
        actions: { setModel, newAddMessage }
    },
    user: {
      aiSettings,
    }
  } = useMicioStore()


  const [deepSeekInstance, setDeepSeekInstance] = useState<OpenAI | null>(null)

  const init = () =>  {
    if (!apisConfig) {
        throw new Error('API configuration is not set.')
      }
    const deepSeekKey = apisConfig[AIProvider.DEEPSEEK]
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com/v1',
      dangerouslyAllowBrowser: true,
      apiKey: deepSeekKey
    })
    return openai
  }

 const changeModel = (model: Model) => {
    setModel(model)
    console.log(`DeepSeek Model changed to ${model.name}`)
  }


  const generateContent = async (statement: string, uploadedFiles?: UploadedFile[]) => {
    let instance: OpenAI | null = null

    if (!deepSeekInstance) {
      instance = init()
      console.log('Deepsek instance initialized')
      setDeepSeekInstance(instance)
    } else {
      instance = deepSeekInstance
    }

    if (!selectedModel) {
      throw new Error('DeepSeek model is not set.')
    }

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

    const { prompt, temperature } = aiSettings
    const completion = await instance.chat.completions.create({
      messages: [
        { role: 'system', content: prompt },
        ...chatHistory,
        { role: 'user', content },
      ],
      model: selectedModel.name,
      temperature,
      stream: true,
    })

    const textMessageId = uuidv4()

    for await (const chunk of completion) {
      const token = chunk.choices[0]?.delta?.content || ''
      const isLastChunk = chunk.choices[0]?.finish_reason !== undefined
      const response: Message = {
        id: textMessageId,
        sender: 'model',
        message: token,
        type: ContentTypes.TEXT,
        isLastPart: isLastChunk
      }
      newAddMessage(response)
    }
  }


  return {
    generateContent,
    changeModel,
  }
}

export default useDeepSeek
