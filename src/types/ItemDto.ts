export type ItemDto = {
  /** Уикальный id предмета, используется для группировки */
  id: string
  /** Название предмета */
  name: string
  /**
   * Линка на иконку
   * Предположим, что некоторые предметы могут иметь невалидный URL */
  icon?: string
  /** Вес предмета в килограммах. */
  singleItemWeight: number
  /** Класс предмета */
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  /**
   * Тип предмета, была задумка сделать фильтрацию по типу,
   * но скорее всего это будет только в следующей версии
   */
  type: 'equipment' | 'consumable' | 'material'
}
