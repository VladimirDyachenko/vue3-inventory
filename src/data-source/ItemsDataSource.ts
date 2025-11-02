import type { InventoryItemList, ItemDto } from '@/types'
import { ITEMS_MOCK } from './itemsMock'
import { getRandomIntInclusive, Logger } from '@/utils'

/**
 * Функция для обработки мокового массива предметов.
 * Чтобы гарантированно исключить мутацию оригинального предмета. при возвращении мы создаем поверхностную копию.
 * Эта копия не должна стать проблемой, учитывая, что функция вызывается только один раз при старте приложения, а предметов относительно мало
 */
const processOriginalItem = (item: ItemDto): [ItemDto['id'], ItemDto] => {
  const id = item.id
  // Объективно искать столько иконок - займет много времени
  // А везде использовать фавикон - сильно убивает атмосферу
  // Поэтому как бы представим, что у части предметов просто битая иконка
  // const isIconExist = Math.random() > 0.7

  // return [id, { ...item, icon: isIconExist ? item.icon : undefined }]
  return [id, item]
}

/**
 * Простой класс выполняющий роль "БД" предметов
 *
 * @export
 * @class ItemsDataSource
 * @typedef {ItemsDataSource}
 */
export class ItemsDataSource {
  private static logger = new Logger({ prefix: 'ItemsDataSource' })

  static #itemsMap: Map<ItemDto['id'], ItemDto> = new Map(ITEMS_MOCK.map(processOriginalItem))

  /**
   * Получить предмет с аналагичным id, в случае отсутствия предмета возвращает null
   *
   * @static
   * @param {ItemDto['id']} itemId id предмета
   * @returns {(ItemDto | null)} предмет или null
   */
  static getItemById(itemId: ItemDto['id']): ItemDto | null {
    return this.#itemsMap.get(itemId) ?? null
  }

  /**
   * Функция для генерации случайного набора предметов, может быть полезна при инициализации инвентаря игрока, или для генерации случайных предметов торговца
   *
   * @static
   * @param {number} itemsAmount
   * @returns {InventoryItemList}
   */
  static getInitialInventory(itemsAmount: number): InventoryItemList {
    if (itemsAmount < 1) return []

    /**
     * В случае, если отсутствуют предметы - мягко падаем и возвращаем заглушку.
     * В реальном мире мы бы скорее всего показали какой-нибудь тост о проблемах с интернетом и вернули ошибку, чтобы в слое представления её можно было обработать
     */
    if (this.#itemsMap.size === 0) {
      this.logger.error('itemsMap size is 0')
      return []
    }

    const result: InventoryItemList = []
    let attempt = 0

    /**
     * Пока не наберем нужное число предметов или не выйдем за ограничение - ищем случайные предметы
     */
    while (result.length < itemsAmount && attempt < itemsAmount) {
      attempt++

      const [_, item] = this.getRandomItem() ?? []
      if (!item) continue
      result.push({ ...item, quantity: getRandomIntInclusive(1, 10) })
    }

    /**
     * Если предметов меньше, чем запрошено - просто возвращаем все
     * что удалось собрать
     */
    if (result.length < itemsAmount) {
      this.logger.error(`Failt to collect ${itemsAmount} unic items`)
    }

    return result
  }

  /**
   * Возвращает кортеж [ключ, случайный_элемент] из мапы
   *
   * @static
   * @returns {([ItemDto['id'], ItemDto] | null)}
   */
  static getRandomItem(): [ItemDto['id'], ItemDto] | null {
    if (this.#itemsMap.size === 0) return null
    const randomIndex = Math.floor(Math.random() * this.#itemsMap.size)

    /**
     * Теоретически, мы можем позволить себе оптимизацию и не выполнять поиск случайного индекса в мапе,
     * а просто вернуть элемент из массива моков. Но делать мы это можем только если их размер одинаковый.
     */
    if (ITEMS_MOCK.length === this.#itemsMap.size) {
      const randomMock = ITEMS_MOCK[randomIndex]
      if (randomMock) {
        /**
         * В момент формирования мапы - мы изменяем предметы из моков.
         * Поэтому, чтобы не вернуть отличающийся предмет - вытаскиваем его обработанный вариант из мапы по id
         */
        let processedItem = this.getItemById(randomMock.id)
        if (!processedItem) {
          this.logger.error(`item with id: ${randomMock.id} missing in internal map`)
          processedItem = randomMock
        }

        return [randomMock.id, processedItem]
      }
    }

    /**
     * В противном случае - идем по дорогому пути перебора
     */
    this.logger.error(
      'randomIndex is out of bounds of ITEMS_MOCK. Fallback for expensive path',
      randomIndex,
      ITEMS_MOCK.length,
    )
    let i = 0
    for (const entry of this.#itemsMap.entries()) {
      if (i === randomIndex) return entry
      i++
    }

    return null
  }
}
