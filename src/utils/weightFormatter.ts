/**
 * Форматтер веса, добаляет юниты
 * @deprecated В UI лучше смотрелся вариант с иконкой
 */
export const weightFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'unit',
  unit: 'kilogram',
  unitDisplay: 'short',
  maximumFractionDigits: 2,
})
