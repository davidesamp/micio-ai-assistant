import OpenAI from 'openai'
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


  const init = () => {
    
    if (!apisConfig) {
      throw new Error('API configuration is not set.')
    }
    const perplexityKey = apisConfig[AIProvider.PERPLEXITY]
    if (!perplexityKey) {
      throw new Error('perplexityKey environment variable is not set.')
    }

    return perplexityKey
  }

  const changeModel = (model: Model) => {
    setModel(model)
    console.log(`Perplexity Model changed to ${model.name}`)
  }

  const generateContent = async (statement: string, uploadedFiles?: UploadedFile[]) => {
    const perplexityKey = init()

    if (!perplexityKey) {
      throw new Error('perplexityKey environment variable is not set.')
    }

    const textMessageId = uuidv4()
    const chatHistory = messages.map((message) => ({
      role: message.sender === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
      content: message.message,
    }))

    if (!selectedModel) {
      throw new Error('Perplexity model is not set.')
    }

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

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${perplexityKey}`
      },
      body: JSON.stringify({
        messages: [
          { role: 'system' as 'system', content: prompt },
          ...chatHistory,
          { role: 'user', content }
        ],
        model: selectedModel.name,
        temperature,
        stream: true,
      })
    })

    if (!response.body) {
      throw new Error('Response body is null.')
    }
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        const response: Message = {
          id: textMessageId,
          sender: 'model',
          message: buffer,
          type: ContentTypes.TEXT,
          isLastPart: true,
        }

        newAddMessage(response)
        break
      }

      const chunkStr = decoder.decode(value, { stream: true })
      const lines = chunkStr.split('\n')

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (!trimmedLine || !trimmedLine.startsWith('data:')) continue

        const jsonStr = trimmedLine.replace(/^data:\s*/, '')
        if (jsonStr === '[DONE]') continue // Perplexity may send this at end of stream

        try {
          const chunkObj = JSON.parse(jsonStr)
          const token = chunkObj.choices?.[0]?.delta?.content || ''
          buffer += token
        } catch (e) {
          console.error('Error parsing JSON:', e)
        }
      }
    }
    
  }

  return {
    generateContent,
    changeModel,
  }
}

export default usePerplexity 