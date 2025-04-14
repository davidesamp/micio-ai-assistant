import { Model } from '@/model/ai'
import { localstorage_prefix } from './constants';


const saveList = (key: string, list: string[]) => {
  localStorage.setItem(key, JSON.stringify(list));
}

const getList = (key: string): string[] => {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

const getItemsWithPrefix = (prefix: string): Record<string, string[]> => {
  const result: Record<string, string[]> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      const value = localStorage.getItem(key);
      try {
        result[key] = JSON.parse(value!); // safely parse JSON values
      } catch {
        result[key] = value ? JSON.parse(value) : []; // fallback to empty array
      }
    }
  }

  return result;
}

export const setChatHistory = (model: Model, firstMessage: string) => {
  const retrievedMessageList = getList(`${localstorage_prefix}-${model.provider}-${model.name}`);
  const finalList = [...retrievedMessageList, firstMessage];
  saveList(`${localstorage_prefix}-${model.provider}-${model.name}`, finalList);
}


export const getChatList = () => {
  const list = getItemsWithPrefix(localstorage_prefix);
  return list
}
