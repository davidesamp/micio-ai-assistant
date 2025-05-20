
/**
 * Get the public URL of a file in the public folder
 * @param path Path to the file relative to the public folder
 * @returns The public URL of the file
 */
export const getPublicUrl = (path: string): string => `${window.location.origin}/public/${path}`