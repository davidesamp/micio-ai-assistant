import OpenAI from 'openai'
import { useState } from 'react'
import { Model } from '@/model/ai'
import { v4 as uuidv4 } from 'uuid'
import { ContentTypes, Message } from '@/model/chat'
import { useMicioStore } from '@/store'

const useDeepSeek = () => {

  const {
  chat: {
    selectedModel,
      actions: { setModel, newAddMessage }
  }
  } = useMicioStore()


  const [deepSeekInstance, setDeepSeekInstance] = useState<OpenAI | null>(null)

  const init = () =>  {
    const deepSeekKey = process.env.DEEP_SEEK_KEY
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


  const generateContent = async (statement: string) => {
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

    const completion = await instance.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: statement },
      ],
      model: selectedModel.name,
      stream: true,
    })

    const textMessageId = uuidv4()

    for await (const chunk of completion) {
      const token = chunk.choices[0]?.delta?.content || ''
      const response: Message = {
        id: textMessageId,
        sender: 'user',
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

export default useDeepSeek
