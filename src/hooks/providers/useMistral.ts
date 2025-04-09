import { Mistral } from '@mistralai/mistralai'
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
      mistralInstance, messages, selectedModel,
      actions: { setMistralInstance, setModel }
    }
  } = useMicioStore()


  const init = () =>  {
    const mistralKey = process.env.MISTRAL_KEY
    if (!mistralKey) {
        throw new Error('MISTRAL_KEY environment variable is not set.')
    }
    const client = new Mistral({ apiKey: mistralKey })
    setMistralInstance(client)
    console.log('Mistral initialized')
  }

  const changeModel = (model: Model) => {
    setModel(model)
    console.log(`Mistral Model changed to ${model.name}`)
  }

  const generateContent = async (statement: string): Promise<GeneratedContent[]> => {
    if (!mistralInstance) {
      throw new Error('Mistral instance is not initialized.')
    }

    if(!selectedModel) {
      throw new Error('Mistral model is not set.')
    }

    const createHistory: MistralMessage[] = messages.filter(msg => msg.sender === 'model').map(msg => ({
      role: MistralRoles.ASSISTANT,
      content: msg.message as string
    })).concat({ role: MistralRoles.USER, content: statement })

    const chatResponse = await mistralInstance.chat.complete({
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
    init,
    generateContent,
    changeModel
  }
}

export default useMistral
