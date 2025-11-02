import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Утилита для формиорвания значинеия аттрибута class
 * @export
 * @param {...ClassValue[]} inputs
 * @returns {*}
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
