import OpenAI from 'openai'
import { Model } from '@/model/ai'
import { ContentTypes, GeneratedContent } from '@/model/chat'
import { useMicioStore } from '@/store'

const useDeepSeek = () => {

  const {
  chat: {
    deepSeekInstance, selectedModel,
    actions: { setDeepSeekInstance, setModel }
  }
  } = useMicioStore()


  const init = () =>  {
    const deepSeekKey = process.env.DEEP_SEEK_KEY
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com/v1',
      dangerouslyAllowBrowser: true,
      apiKey: deepSeekKey
    })

    setDeepSeekInstance(openai)
    console.log('DeepSeek initialized')
  }

 const changeModel = (model: Model) => {
    setModel(model)
    console.log(`DeepSeek Model changed to ${model.name}`)
  }


  const generateContent = async (statement: string): Promise<GeneratedContent[]> => {
    if (!deepSeekInstance) {
      throw new Error('DeepSeek instance is not initialized.')
    }

    if (!selectedModel) {
      throw new Error('DeepSeek model is not set.')
    }

    const completion = await deepSeekInstance.chat.completions.create({
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
    init,
    generateContent,
    changeModel,
  }
}

export default useDeepSeek
