export enum AIProvider {
  GEMINI = 'GEMINI',
  DEEPSEEK = 'DEEPSEEK',
  MISTRAL = 'MISTRAL',
  OPENAI = 'OPENAI',
  PERPLEXITY = 'PERPLEXITY'
}

export interface Notiication {
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  description: string
}