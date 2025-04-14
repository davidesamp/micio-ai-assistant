import { useState } from 'react'
import useDeepSeek from './providers/useDeepseek'
import useGemini from './providers/useGemini'
import useMistral from './providers/useMistral'
import useOpenAi from './providers/useOpenAi'
import { Model } from '@/model/ai'
import { GeneratedContent, Message } from '@/model/chat'
import { AIProvider } from '@/model/ui'
import { useMicioStore } from '@/store'
import { setChatHistory } from '@/utils/localStorage'

const useGenerateContent = () => {

  const {
    chat: {
      selectedModel,
    },
    ui: {
      currentAiProvider,
      actions: { setAiProvider }
    },
    chat: {
      actions: { addMessage, resetMessages }
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

  const generate = async (statement: string) => {
    if (!currentAiProvider) {
      throw new Error('AI provider is not initialized.')
    }
    setIsGenerating(true)
    try {
      const generatedContent: GeneratedContent[] = await generateContentFactory[currentAiProvider](statement)
      if (generatedContent) {
        addMessage({ statement, generatedContent })
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
    if (selectedModel) setChatHistory(selectedModel, statement)
  }
  
  const changeModel = (model: Model) => {
    setAiProvider(model.provider)
    changeModelFactory[model.provider](model)
    resetMessages()
  }

  const restoreChat = (model: Model, messages: Message[]) => {
    console.log('Restoring chat with model:', model.name)
    console.log('Restoring chat with messages:', messages)
  }

  return {
    isGenerating,
    generate,
    changeModel,
    restoreChat
  }
}

export default useGenerateContent
