import { ItemsDataSource } from '@/data-source'
import type { InventoryItemList } from '@/types'
import { Logger } from '@/utils'

export class InventoryStoreSerealizer {
  // Логер бы желательно принимать через DI, это бы и тесты упростило, но я реализация DI в тестовом проекте - заняла бы слишком много времени
  // И я не уверен, что inject из vue нормально бы работал в условиях тестов при отсутствии контекста самого vue приложения
  private static logger = new Logger({ prefix: 'InventoryStoreSerealizer' })

  /**
   * Метод, который парсит данные сохраненные в хранилище и возвращает список готовый к использвоанию. В случае ошибки - вернется null
   * @static
   * @param {string} value
   * @returns {(InventoryItemList | null)} "обогащенный" массив предметов
   * **Если был сохранен неизвестный предмет - он не попадет инвентарь**
   */
  static deserialize(value: string): InventoryItemList | null {
    try {
      // В реальном проекте тут дожна быть валидация инпута, например по схеме, какой-нибдуь zod или его аналог - идеально подойдет
      // Ожидаемый формат [[id, quantity]]
      const itemsList = JSON.parse(value)
      const result: InventoryItemList = []

      for (const [itemId, quantity] of itemsList) {
        const item = ItemsDataSource.getItemById(itemId)
        // Если предмет есть в "БД" - добавляем его в инвентарь
        if (item) {
          result.push({ ...item, quantity: quantity })
        }
      }
      return result
    } catch (error) {
      this.logger.error('got error on deserialize:', error)
      return null
    }
  }

  /**
   * Для минимазации шанса поймать лимит Storage'а мы сохраняем только id предмета и его колличество. В случае ошибки - вернется null.
   * @static
   * @param {InventoryItemList} value список предметов в инвентаре
   * @returns {(string | null)}
   */
  static serialize(value: InventoryItemList): string | null {
    try {
      const valueToSave: [string, number][] = value.map((item) => [item.id, item.quantity])
      return JSON.stringify(valueToSave)
    } catch (err) {
      this.logger.error('got error on serialize', err)
      return null
    }
  }
}
