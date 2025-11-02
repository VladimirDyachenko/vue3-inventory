/**
 * Возвращает случайное целое число из диапазона min...max, включительно
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const getRandomIntInclusive = (min: number, max: number): number => {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled)
}
