export interface GeneratedContent {
  content: string;
  type: ContentTypes;
}

export enum ContentTypes {
  TEXT = 'text',
  IMAGE = 'image',
}

export interface Message {
  id: string;
  sender: string
  message: string;
  type: ContentTypes;
}