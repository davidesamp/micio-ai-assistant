import OpenAI from 'openai'
import { useState } from 'react'
import { Model } from '@/model/ai'
import { ContentTypes, GeneratedContent } from '@/model/chat'
import { useMicioStore } from '@/store'

const useDeepSeek = () => {

  const {
  chat: {
    selectedModel,
    actions: { setModel }
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


  const generateContent = async (statement: string): Promise<GeneratedContent[]> => {
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
    })

    const generatedMessage = completion.choices[0].message.content
    return [{ content: generatedMessage ?? '', type: ContentTypes.TEXT }]
  }


  return {
    generateContent,
    changeModel,
  }
}

export default useDeepSeek
