
import { useState } from 'react'
import useDeepSeek from './providers/useDeepseek'
import useGemini from './providers/useGemini'
import useMistral from './providers/useMistral'
import { AIProvider } from '@/model/ui'
import { useMicioStore } from '@/store'

const useGenerateContent = () => {

  const {
    ui: {
      currentAiProvider,
      actions: { setAiProvider }
    },
    chat: {
      actions: { addMessage }
    }
  } = useMicioStore()

  const [isGenerating, setIsGenerating] = useState(false)

  const { init: initGemini, generateContent: generateGeminiContent } = useGemini()
  const { init: initDeepSeek, generateContent: generateDeepSeekContent } = useDeepSeek()
  const { init: initMistral, generateContent: generateMistralContent } = useMistral()

  const initProviderFactory = {
    [AIProvider.GEMINI]: initGemini,
    [AIProvider.DEEPSEEK]: initDeepSeek,
    [AIProvider.MISTRAL]: initMistral
  }

  const generateContentFactory = {
    [AIProvider.GEMINI]: generateGeminiContent,
    [AIProvider.DEEPSEEK]: generateDeepSeekContent,
    [AIProvider.MISTRAL]: generateMistralContent
  }

  const initAIProvider = (selectedProvider: AIProvider) => {  
    initProviderFactory[selectedProvider]()
    setAiProvider(selectedProvider)
  }

  const generate = async (statement: string) => {
    if (!currentAiProvider) {
      throw new Error('AI provider is not initialized.')
    }
    setIsGenerating(true)
    try {
      const generatedContent = await generateContentFactory[currentAiProvider](statement)
      if (generatedContent) {
        addMessage({ statement, generatedContent })
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  } 

  return {
    initAIProvider,
    isGenerating,
    generate,
  }
}

export default useGenerateContent
