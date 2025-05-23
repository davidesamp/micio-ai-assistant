import { Model } from './ai'

export interface GeneratedContent {
  content: string;
  type: ContentTypes;
}

export enum ContentTypes {
  // eslint-disable-next-line no-unused-vars
  TEXT = 'text',
  // eslint-disable-next-line no-unused-vars
  IMAGE = 'image',
}

export interface Message {
  id: string;
  sender: string
  message: string;
  files?: UploadedFile[]
  type: ContentTypes;
  isLastPart?: boolean;
}


export interface MicioChat {
  uuid: string;
  model: Model;
  messages: Message[];
  userId: string;
  createdAt: any; // This will be a Firestore Timestamp
}

export interface UploadedFile {
  mimeType: string,
  data: string
  uid: string
}