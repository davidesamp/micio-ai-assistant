import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useDeepSeek from './providers/useDeepseek'
import useGemini from './providers/useGemini'
import useMistral from './providers/useMistral'
import useOpenAi from './providers/useOpenAi'
import { Model } from '@/model/ai'
import { ContentTypes, Message, UploadedFile } from '@/model/chat'
import { AIProvider } from '@/model/ui'
import { useMicioStore } from '@/store'

const useGenerateContent = () => {

  const {
    ui: {
      currentAiProvider,
      actions: { setAiProvider }
    },
    chat: {
      actions: { resetMessages, newAddMessage, setChatUid, restoreMessages }
    }
  } = useMicioStore()

  const [isGenerating, setIsGenerating] = useState(false)

  const { 
    generateContent: generateGeminiContent,
    changeModel: changeGeminiModel
  } = useGemini()

  const { 
    generateContent: generateDeepSeekContent,
    changeModel: changeDeepSeekModel
  } = useDeepSeek()

  const { 
    generateContent: generateMistralContent,
    changeModel: changeMistralModel
  } = useMistral()

  const { 
    generateContent: generateOpenAiContent,
    changeModel: changeOpenAiModel
  } = useOpenAi()

  const generateContentFactory = {
    [AIProvider.GEMINI]: generateGeminiContent,
    [AIProvider.DEEPSEEK]: generateDeepSeekContent,
    [AIProvider.MISTRAL]: generateMistralContent,
    [AIProvider.OPENAI]: generateOpenAiContent
  }

  const changeModelFactory = {
    [AIProvider.GEMINI]: changeGeminiModel,
    [AIProvider.DEEPSEEK]: changeDeepSeekModel,
    [AIProvider.MISTRAL]: changeMistralModel,
    [AIProvider.OPENAI]: changeOpenAiModel
  }

  const generate = async (statement: string, uploadedFiles?: UploadedFile[]) => {
    if (!currentAiProvider) {
      throw new Error('AI provider is not initialized.')
    }
    setIsGenerating(true)
    try {
      const question: Message = {
        id: uuidv4(),
        sender: 'user',
        message: statement,
        type: ContentTypes.TEXT,
      }
      newAddMessage(question)
      console.log('Generating content with provider:', currentAiProvider)
      await generateContentFactory[currentAiProvider](statement, uploadedFiles)
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  const changeModel = (model: Model, chatMessages: Message[] = [], chatUid?: string) => {
    setAiProvider(model.provider)
    changeModelFactory[model.provider](model, chatMessages)
    if(!chatUid) {
      const newChatUid = uuidv4()
      setChatUid(newChatUid)
    } else  {
      setChatUid(chatUid)
    }
    resetMessages()
  }

  const restoreChat = (model: Model, messages: Message[], chatUid: string) => {
    changeModel(model, messages, chatUid)
    restoreMessages(messages)
  }

  return {
    isGenerating,
    generate,
    changeModel,
    restoreChat
  }
}

export default useGenerateContent
