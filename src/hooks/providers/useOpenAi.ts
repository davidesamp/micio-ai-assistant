import OpenAI from 'openai'
import { useState } from 'react'
import { Model } from '@/model/ai'
import { ContentTypes, GeneratedContent } from '@/model/chat'
import { useMicioStore } from '@/store'

const useOpenAi = () => {
  const {
    chat: {
      selectedModel,
      actions: { setModel }
    }
  } = useMicioStore()

  const [openAiInstance, setOpenAiInstance] = useState<OpenAI | null>(null)

  const init = () => {
    const openAiKey = process.env.OPENAI_KEY
    if (!openAiKey) {
      throw new Error('OPENAI_KEY environment variable is not set.')
    }
    const openai = new OpenAI({
      apiKey: openAiKey,
      dangerouslyAllowBrowser: true
    })
    return openai
  }

  const changeModel = (model: Model) => {
    setModel(model)
    console.log(`OpenAI Model changed to ${model.name}`)
  }

  const generateContent = async (statement: string): Promise<GeneratedContent[]> => {
    let instance: OpenAI | null = null

    if (!openAiInstance) {
      instance = init()
      console.log('OpenAI instance initialized')
      setOpenAiInstance(instance)
    } else {
      instance = openAiInstance
    }

    if (!selectedModel) {
      throw new Error('OpenAI model is not set.')
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

export default useOpenAi 