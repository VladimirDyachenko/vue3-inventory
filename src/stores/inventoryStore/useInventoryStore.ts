import { usePersistentStorage } from '@/composables'
import { ItemsDataSource } from '@/data-source'
import type { ItemDto } from '@/types'
import type { InventoryItemList } from '@/types/InventoryItem'
import { Logger } from '@/utils/logger'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { InventoryStoreSerealizer } from './inventoryStoreSerealizer'

const inventoryStoreLogger = new Logger({ prefix: 'useInventoryStore' })

const INITIAL_INVENTORY = ItemsDataSource.getInitialInventory(10)

const STORAGE_KEY = 'inventory'

export const useInventoryStore = defineStore(STORAGE_KEY, () => {
  /**
   * Инициализируем стор с сохранением в LocalStorage
   * В реальном мире тут должна быть валидация данных, например через zod схему, но в рамках демки мы чуть-чуть отступили от законов здравого смысла.
   * Ну и хранить мы это будем не в LocaStorage, а получать из api'шки
   */
  const items = usePersistentStorage<InventoryItemList>(`${STORAGE_KEY}_items`, ref([]), {
    type: 'local',
    autoSave: true,
    deserialize: (value): InventoryItemList => {
      const result = InventoryStoreSerealizer.deserialize(value)
      if (!result) {
        inventoryStoreLogger.error(
          'no items was retrived from local storage, will use initial value',
        )
        return INITIAL_INVENTORY
      }
      return result
    },
    serialize: (value): string => {
      const serealized = InventoryStoreSerealizer.serialize(value)
      if (serealized === null) {
        inventoryStoreLogger.error(
          'got error on local storage serialization, will return empty string',
        )
        return ''
      }

      return serealized
    },
  })

  /**
   * Вычисляем статистику предметов в инвентаре
   */
  const totalItemsStats = computed(() => {
    const computedStats = items.value.reduce(
      (stats, { singleItemWeight, quantity }) => {
        stats.itemsCount = stats.itemsCount + quantity
        stats.totalWeight = stats.totalWeight + quantity * singleItemWeight

        return stats
      },
      { itemsCount: 0, totalWeight: 0 },
    )
    return computedStats
  })

  /**
   * Действие для добавления предмета. Ищет предмет по свойству id, в случае, если предмет существет в инвентаре - увеличиваем колличество, в противном добавляем в список.
   * В реальном мире, мы бы скорее всего подписывались на событие из WS'а или любого EventListener'а (SSE, window.addEventListener('message'))
   */
  function addItem(newItem: ItemDto, amount = 1): void {
    const existingItem = items.value.find((i) => i.id === newItem.id)

    if (existingItem) {
      inventoryStoreLogger.debug(`increment item with id: ${newItem.id} amount: ${amount}`)
      existingItem.quantity += amount
    } else {
      inventoryStoreLogger.debug(`add new item with id: ${newItem.id} amount: ${amount}`)
      items.value.push({ ...newItem, quantity: amount })
    }
  }

  /**
   * Действие для уменьшения колличества предмета.
   */
  function decrementItemById(itemId: string, amount = 1): void {
    const index = items.value.findIndex((i) => i.id === itemId)
    const target = items.value[index]
    if (target === undefined) {
      inventoryStoreLogger.error(
        `trying to remove item with id: ${itemId} and amount: ${amount}, but item with same id not found`,
      )
      return
    }

    target.quantity -= amount
    inventoryStoreLogger.debug(`decrement id: ${itemId} by ${amount}`)

    if (target.quantity <= 0) {
      inventoryStoreLogger.debug(
        `id: ${itemId} now has amount less then 0, removing item from array`,
      )
      items.value.splice(index, 1)
    }
  }

  /**
   * Действие для удаления всех предметов по id
   */
  function removeAllItemsById(itemId: string): void {
    inventoryStoreLogger.debug(`remove all items with id: ${itemId}`)
    items.value = items.value.filter((inventoryItem) => inventoryItem.id !== itemId)
  }

  return {
    items,
    totalItemsStats,
    addItem,
    removeItemById: decrementItemById,
    removeAllItemsById,
  }
})
