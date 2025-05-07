import { Mistral } from '@mistralai/mistralai'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Model } from '@/model/ai'
import { ContentTypes, Message, UploadedFile } from '@/model/chat'
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
      messages, selectedModel,
      actions: { setModel, newAddMessage }
    },
    user: {
      aiSettings,
    }
  } = useMicioStore()

  const [mistralInstance, setMistralInstance] = useState<Mistral | null>(null)


  const init = () =>  {
    const mistralKey = process.env.MISTRAL_KEY
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

    for await (const chunk of result) {
      const streamText = chunk.data.choices[0].delta.content
      const isLastChunk = chunk.data.choices[0].finishReason !== undefined
      const response: Message = {
        id: textMessageId,
        sender: 'model',
        message: streamText as string,
        type: ContentTypes.TEXT,
        isLastPart: isLastChunk
      }
      newAddMessage(response)
    }
  }

  return {
    generateContent,
    changeModel
  }
}

export default useMistral
