import { Mistral } from '@mistralai/mistralai'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Model } from '@/model/ai'
import { ContentTypes, Message, UploadedFile } from '@/model/chat'
import { AIProvider } from '@/model/ui'
import { useMicioStore } from '@/store'

enum MistralRoles {
  // eslint-disable-next-line no-unused-vars
  USER = 'user',
  // eslint-disable-next-line no-unused-vars
  ASSISTANT = 'assistant',
  // eslint-disable-next-line no-unused-vars
  SYSTEM = 'system',
  // eslint-disable-next-line no-unused-vars
  TOOL = 'tool'
}

interface MistralMessage  {
  role: MistralRoles
  content: string
}

const useMistral = () => {

  const {
    chat: {
      messages, selectedModel, apisConfig,
      actions: { setModel, newAddMessage }
    },
    user: {
      aiSettings,
    }
  } = useMicioStore()

  const [mistralInstance, setMistralInstance] = useState<Mistral | null>(null)


  const init = () =>  {
    if (!apisConfig) {
      throw new Error('API configuration is missing. Please ensure that the API configuration is properly set.')
    }
    const mistralKey = apisConfig[AIProvider.MISTRAL]
    if (!mistralKey) {
        throw new Error('MISTRAL_KEY environment variable is not set.')
    }
    const client = new Mistral({ apiKey: mistralKey })
    return client
  }

  const changeModel = (model: Model) => {
    setModel(model)
    console.log(`Mistral Model changed to ${model.name}`)
  }

  const generateContent = async (statement: string, uploadedFiles?: UploadedFile[]) => {
    let instance: Mistral | null = null 
    if (!mistralInstance) {
      instance = init()
      console.log('Mistral instance initialized')
      setMistralInstance(instance)
    } else {
      instance = mistralInstance
    }

    if(!selectedModel) {
      throw new Error('Mistral model is not set.')
    }
    
    const textMessageId = uuidv4()

    let content = statement
    if (uploadedFiles && uploadedFiles.length > 0) {
      // For now, we'll just append the image URLs to the text content
      // since Mistral's API doesn't support image content directly
      const imageDescriptions = uploadedFiles.map((file, index) => 
        `[Image ${index + 1}: ${file.mimeType}]`
      ).join('\n')
      content = `${imageDescriptions}\n\n${statement}`
    }

    const createHistory: MistralMessage[] = messages.filter(msg => msg.sender === 'model').map(msg => ({
      role: MistralRoles.ASSISTANT,
      content: msg.message as string
    })).concat({ 
      role: MistralRoles.USER, 
      content 
    })

    const { temperature } = aiSettings

    const result = await instance.chat.stream({
      model: selectedModel.name,
      temperature: temperature,
      stream: true,
      
      messages: [...createHistory],
    })


    let buffer = ''
    let timeoutId: number | null = null

    const flushBuffer = (isFinal = false) => {
      if (!buffer) return

      const response: Message = {
        id: textMessageId,
        sender: 'model',
        message: buffer,
        type: ContentTypes.TEXT,
        isLastPart: isFinal,
      }

      newAddMessage(response)
      buffer = ''
    }

    for await (const chunk of result) {
      const streamText = chunk.data.choices[0].delta.content
      const finishReason = chunk.data.choices[0]?.finishReason
      const isLastChunk = !!finishReason

      buffer += streamText

      if (!timeoutId) {
        timeoutId = window.setTimeout(() => {
          flushBuffer()
          timeoutId = null
        }, 500) // flush every 500ms
      }

      if (isLastChunk) {
        if (timeoutId) window.clearTimeout(timeoutId)
        flushBuffer(true)
      }
  }
}

  return {
    generateContent,
    changeModel
  }
}

export default useMistral
