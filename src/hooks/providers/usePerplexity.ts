import OpenAI from 'openai'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Model } from '@/model/ai'
import { ContentTypes, Message, UploadedFile } from '@/model/chat'
import { AIProvider } from '@/model/ui'
import { useMicioStore } from '@/store'

const usePerplexity = () => {
  const {
    chat: {
      selectedModel, messages, apisConfig,
      actions: { setModel, newAddMessage }
    },
    user: {
      aiSettings,
    }
  } = useMicioStore()

  const [perplexityInstance, setPerplexityInstance] = useState<OpenAI | null>(null)

  const init = () => {
    
    if (!apisConfig) {
      throw new Error('API configuration is not set.')
    }
    const perplexityKey = apisConfig[AIProvider.PERPLEXITY]
    if (!perplexityKey) {
      throw new Error('perplexityKey environment variable is not set.')
    }
    const perplexity = new OpenAI({
      apiKey: perplexityKey,
      baseURL: 'https://api.perplexity.ai',
      dangerouslyAllowBrowser: true
    })
    return perplexity
  }

  const changeModel = (model: Model) => {
    setModel(model)
    console.log(`Perplexity Model changed to ${model.name}`)
  }

  const generateContent = async (statement: string, uploadedFiles?: UploadedFile[]) => {
    let instance: OpenAI | null = null

    if (!perplexityInstance) {
      instance = init()
      console.log('Perplexity instance initialized')
      setPerplexityInstance(instance)
    } else {
      instance = perplexityInstance
    }

    if (!selectedModel) {
      throw new Error('Perplexity model is not set.')
    }

    const textMessageId = uuidv4()
    const chatHistory = messages.map((message) => ({
      role: message.sender === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
      content: message.message,
    }))

    const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = []

    if (uploadedFiles) {
      uploadedFiles.forEach((file) => {
        content.push({
          type: 'image_url',
          image_url: {
            url: `data:${file.mimeType};base64,${file.data}`
          }
        })
      })
    }

    if (statement) {
      content.push({
        type: 'text',
        text: statement
      })
    }

    const { prompt, temperature } = aiSettings

    const completion = await instance.chat.completions.create({
      messages: [
        { role: 'system' as 'system', content: prompt },
        ...chatHistory,
        { role: 'user', content },
      ],
      model: selectedModel.name,
      temperature,
      stream: true,
    })

    let buffer = ''
    let timeoutId: number| null = null

    const flushBuffer = (isFinal = false) => {
      if (!buffer) return

      const response: Message = {
        id: textMessageId,
        sender: 'model',
        message: buffer,
        type: ContentTypes.TEXT,
        isLastPart: isFinal,
      }

      newAddMessage(response)
      buffer = ''
    }

    for await (const chunk of completion) {
      const token = chunk.choices[0]?.delta?.content || ''
      const finishReason = chunk.choices[0]?.finish_reason
      const isLastChunk = !!finishReason

      buffer += token

      if (!timeoutId) {
        timeoutId = window.setTimeout(() => {
          flushBuffer()
          timeoutId = null
        }, 500) // flush every 500ms
      }

      if (isLastChunk) {
        if (timeoutId) window.clearTimeout(timeoutId)
        flushBuffer(true)
      }
    }
  }

  return {
    generateContent,
    changeModel,
  }
}

export default usePerplexity 