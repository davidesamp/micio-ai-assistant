import { Mistral } from '@mistralai/mistralai'
import { useState } from 'react'
import { Model } from '@/model/ai'
import { ContentTypes, GeneratedContent } from '@/model/chat'
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
      actions: { setModel }
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

  const generateContent = async (statement: string): Promise<GeneratedContent[]> => {

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

    const createHistory: MistralMessage[] = messages.filter(msg => msg.sender === 'model').map(msg => ({
      role: MistralRoles.ASSISTANT,
      content: msg.message as string
    })).concat({ role: MistralRoles.USER, content: statement })

    const chatResponse = await instance.chat.complete({
      model: selectedModel.name,
      messages: [...createHistory]
    })
    if (!chatResponse.choices || chatResponse.choices.length === 0) {
      throw new Error('No choices returned in the chat response.')
    }
    const generatedMessage = chatResponse.choices[0].message.content as string
    return [{ content: generatedMessage, type: ContentTypes.TEXT }]
  }

  return {
    generateContent,
    changeModel
  }
}

export default useMistral
