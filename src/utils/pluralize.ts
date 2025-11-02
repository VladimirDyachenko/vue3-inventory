/**
 * Функция для выбора правильной формы слова на основе числа
 * @export
 * @param {number} count число предметов
 * @param {[string, string, string]} forms Формы слов `['предмет', 'предмета', 'предметов']`
 * @returns {string} корректная форма `pluralize(1, ['предмет', 'предмета', 'предметов']) => 'предмет'`
 */
export function pluralize(count: number, forms: [string, string, string]) {
  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}
