import { ItemsDataSource } from '@/data-source'
import type { InventoryItem, InventoryItemList, ItemDto } from '@/types'
import { Logger } from '@/utils'
import { computed, ref, type ComputedRef, type Ref } from 'vue'

const remoteInventoryLogger = new Logger({ prefix: 'useRemoteInventory' })

type RemoteInventoryActionPaylaod = {
  method: 'increase' | 'decrease'
  itemId: ItemDto['id']
  amount: number
}

type RemoteInventoryActionResult =
  | { success: false; message: string }
  | { success: true; item: InventoryItem }

type RemoteInventoryApi = {
  itemsList: Ref<InventoryItemList>
  stats: ComputedRef<{
    totalWeight: number
    totalItems: number
  }>
  safeMutate: (action: RemoteInventoryActionPaylaod) => Promise<RemoteInventoryActionResult>
}

/**
 * Такая минимальная версия представляющая собой некое подобие API
 * В реальном проекте, тут может быть что-то вроде мутаций
 * из Tanstack Query.
 * Сперва была идея сделать это надстройкой над стором,
 * но посчитал, что инвентари торговцев должны быть каждый раз новый
 * @param {string} inventoryId
 * @returns {RemoteInventoryApi}
 */
export function useRemoteInventory(inventoryId: string): RemoteInventoryApi {
  /**
   * Предположим, что это квери которая возвращает список из api и использует для этого id второго инвентаря
   */
  const itemsList = ref(ItemsDataSource.getInitialInventory(15))

  function safeMutate(paylaod: RemoteInventoryActionPaylaod): Promise<RemoteInventoryActionResult> {
    remoteInventoryLogger.debug('inventoryId:', inventoryId, 'got action: ', paylaod)

    return new Promise((resolve) => {
      const itemEntity = ItemsDataSource.getItemById(paylaod.itemId)

      if (!itemEntity) {
        return resolve({
          success: false,
          message: 'Ошибка 404: предмета больше не существует',
        })
      }

      switch (paylaod.method) {
        case 'increase':
          const existingItem = itemsList.value.find((i) => i.id === paylaod.itemId)
          if (existingItem) {
            existingItem.quantity += paylaod.amount
            return resolve({
              item: existingItem,
              success: true,
            })
          }

          const newItem = {
            ...itemEntity,
            quantity: paylaod.amount,
          }

          itemsList.value.push(newItem)
          return resolve({
            item: newItem,
            success: true,
          })
        case 'decrease':
          const index = itemsList.value.findIndex((i) => i.id === paylaod.itemId)
          const target = itemsList.value[index]

          if (!target) {
            return resolve({
              success: false,
              message: 'У торговца больше нет этого предмета',
            })
          }

          target.quantity -= paylaod.amount
          if (target.quantity < 1) {
            itemsList.value.splice(index, 1)
          }
          return resolve({
            item: target,
            success: true,
          })
        default:
          remoteInventoryLogger.error('Unknown action: ', paylaod)
          return resolve({
            success: false,
            message: 'Действие неподдерживается',
          })
      }
    })
  }

  const stats = computed(() => {
    return itemsList.value.reduce(
      (stats, current) => {
        stats.totalItems = stats.totalItems + current.quantity
        stats.totalWeight = stats.totalWeight + current.quantity * current.singleItemWeight

        return stats
      },
      { totalItems: 0, totalWeight: 0 },
    )
  })

  return { itemsList, safeMutate, stats }
}
