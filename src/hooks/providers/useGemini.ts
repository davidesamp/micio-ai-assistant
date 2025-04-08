import { GoogleGenAI } from '@google/genai'
import { ContentTypes, GeneratedContent } from '@/model/chat'
import { useMicioStore } from '@/store'
import { GeminiModalitiesByModel } from '@/utils/restrictions'

const useGemini = () => {

const {
 chat: {
  currentChat, geminiInstance,
  actions: { setCurrentChat, setGeminiInstance, resetMessages }
 }
} = useMicioStore()


  const init = () =>  {
    const googleGeminiKey = process.env.GOOGLE_GEMINI_KEY
    if (!googleGeminiKey) {
      throw new Error('GOOGLE_GEMINI_KEY environment variable is not set.')
    }
    const genAI = new GoogleGenAI({ apiKey: googleGeminiKey })
    const chatSession = genAI.chats.create({
      history: [], // Initialize empty chat history
      model: 'gemini-2.0-flash-exp-image-generation',
      config: {
        responseModalities: ['Text', 'Image'],
      },
    })

    setGeminiInstance(genAI)  
    setCurrentChat(chatSession)
    console.log('Gemini initialized')
  }

  const changeModel = (model: string) => {
    if (!geminiInstance) {
      throw new Error('Current gemini instance is not initialized.')
    }

    // const currentHistory = currentChat?.getHistory()
    const newChatSession = geminiInstance.chats.create({
      history: [], 
      model: model,
      config: {
        //@ts-expect-error type with existing model
        responseModalities: GeminiModalitiesByModel[model],
      },
    })
    setCurrentChat(newChatSession)
    resetMessages()
    console.log(`Model changed to ${model}`)
  }


  const generateContent = async (statement: string): Promise<GeneratedContent[]> => {
    if(!currentChat) {
      throw new Error('Current chat session is not initialized.')
    }

    const response = await currentChat.sendMessage({
      message: statement
    })

    let generatedContents: GeneratedContent[] = []
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        generatedContents.push({ content: part.text, type: ContentTypes.TEXT })
      } else if (part.inlineData) {
        const imageData = part.inlineData.data
        if (!imageData) {
          throw new Error('Image data is undefined.')
        }
        generatedContents.push({ content: imageData, type: ContentTypes.IMAGE })
      }
    }

    return generatedContents
  }

  return {
    init,
    generateContent,
    changeModel
  }
}

export default useGemini
