import { AIProvider } from '@/model/ui'

const LOCAL_STORAGE_KEY = 'apis'

/**
 * Load API configurations from localStorage
 */
function loadApis(): Record<AIProvider, string> | null {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Record<AIProvider, string>
  } catch (err) {
    console.error('Failed to parse localStorage apis', err)
    return null
  }
}

/**
 * Persist API configurations to localStorage
 */
function persistApis(config: Record<AIProvider, string>): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config))
  } catch (err) {
    console.error('Failed to save apis to localStorage', err)
  }
}

/**
 * Save API keys/configs to localStorage as a fallback
 */
export async function saveApis(
  apiConfig: Record<AIProvider, string>
): Promise<void> {
  persistApis(apiConfig)
}

/**
 * Retrieve API keys/configs from localStorage
 */
export async function getApisConfig(): Promise<Record<AIProvider, string> | null> {
  return loadApis()
}
