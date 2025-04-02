export interface GeneratedContent {
  content: string;
  type: 'text' | 'image';
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