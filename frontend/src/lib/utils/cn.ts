import { clsx } from 'clsx'

/**
 * Utility function to merge class names
 * @param classes - Array of class names to merge
 * @returns Merged class names string
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return clsx(classes.filter(Boolean))
}