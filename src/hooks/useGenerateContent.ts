
import { useState } from 'react'
import useDeepSeek from './providers/useDeepseek'
import useGemini from './providers/useGemini'
import useMistral from './providers/useMistral'
import { Model } from '@/model/ai'
import { GeneratedContent } from '@/model/chat'
import { AIProvider } from '@/model/ui'
import { useMicioStore } from '@/store'

const useGenerateContent = () => {

  const {
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


  const generateContentFactory = {
    [AIProvider.GEMINI]: generateGeminiContent,
    [AIProvider.DEEPSEEK]: generateDeepSeekContent,
    [AIProvider.MISTRAL]: generateMistralContent
  }

  const changeModelFactory = {
    [AIProvider.GEMINI]: changeGeminiModel,
    [AIProvider.DEEPSEEK]: changeDeepSeekModel,
    [AIProvider.MISTRAL]: changeMistralModel
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
  }
  
  const changeModel = (model: Model) => {
    setAiProvider(model.provider)
    changeModelFactory[model.provider](model)
    resetMessages()
  }

  return {
    isGenerating,
    generate,
    changeModel
  }
}

export default useGenerateContent
