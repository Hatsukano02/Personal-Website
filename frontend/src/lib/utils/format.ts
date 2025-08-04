/**
 * Format date for display
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

/**
 * Calculate reading time based on word count
 * @param wordCount - Number of words in the content
 * @returns Reading time string
 */
export const formatReadingTime = (wordCount: number): string => {
  const wordsPerMinute = 200
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} 分钟阅读`
}

/**
 * Format number with locale-specific formatting
 * @param number - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('zh-CN').format(number)
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text with ellipsis
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}