import { GoogleGenAI } from '@google/genai'
import { ContentTypes } from '@/model/chat'
import { useMicioStore } from '@/store'

const useGemini = () => {

const {
 chat: {
  geminiInstance,
  actions: { setGeminiInstance }
 }
} = useMicioStore()


  const init = () =>  {
    const googleGeminiKey = process.env.GOOGLE_GEMINI_KEY
    if (!googleGeminiKey) {
      throw new Error('GOOGLE_GEMINI_KEY environment variable is not set.')
    }
    const genAI = new GoogleGenAI({ apiKey: googleGeminiKey })
    setGeminiInstance(genAI)
    console.log('Gemini initialized')
  }

  const generateContent = async (statement: string) => {
    if (!geminiInstance) {
      throw new Error('Gemini instance is not initialized.')
    }

    const response = await geminiInstance.models.generateContent({
      model: 'gemini-2.0-flash-exp-image-generation',
      contents: statement,
      config: {
        responseModalities: ['Text', 'Image'],
      },
    })

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        return { content: part.text, type: ContentTypes.TEXT }
      } else if (part.inlineData) {
        const imageData = part.inlineData.data
        if (!imageData) {
          throw new Error('Image data is undefined.')
        }
        return { content: imageData, type: ContentTypes.IMAGE }
      }
    }

    return { content: '', type: ContentTypes.TEXT }
  }

  return {
    init,
    generateContent,
  }
}

export default useGemini
