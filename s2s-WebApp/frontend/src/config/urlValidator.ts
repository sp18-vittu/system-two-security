import { allowedUrls } from '../config/allowedUrls'

export const isAllowedUrl = (url: string): boolean => {
  try {
    const baseUrl = new URL(url).origin
    return allowedUrls.includes(baseUrl)
  } catch (error) {
    console.error('Invalid URL', error)
    return false
  }
}
