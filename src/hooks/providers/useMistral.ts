import { Mistral } from '@mistralai/mistralai'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Model } from '@/model/ai'
import { ContentTypes, Message } from '@/model/chat'
import { useMicioStore } from '@/store'

enum MistralRoles {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
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

  const generateContent = async (statement: string) => {

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

    const question: Message = {
      id: uuidv4(),
      sender: 'model',
      message: statement,
      type: ContentTypes.TEXT,
    }
    newAddMessage(question)

    const textMessageId = uuidv4()

    const createHistory: MistralMessage[] = messages.filter(msg => msg.sender === 'model').map(msg => ({
      role: MistralRoles.ASSISTANT,
      content: msg.message as string
    })).concat({ role: MistralRoles.USER, content: statement })

    const result = await instance.chat.stream({
      model: selectedModel.name,
      messages: [...createHistory],
    });

    for await (const chunk of result) {
      const streamText = chunk.data.choices[0].delta.content;
      const response: Message = {
        id: textMessageId,
        sender: 'user',
        message: streamText as string,
        type: ContentTypes.TEXT,
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
