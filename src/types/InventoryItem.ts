import type { ItemDto } from './ItemDto'

/**
 * Описание ентити предмета в инвентаре
 * Тип основан на ItemDto и добавляет число предметов в инвентаре
 * В реальном проекте, мы бы скорее всего хотели отделить сущность предмета от полей нужных инвентарю
 * Но в рамках демо, ентити {itemDefenition: ItemDto, quantity: number } смотрится странно
 */
export type InventoryItem = Pick<
  ItemDto,
  'icon' | 'id' | 'name' | 'singleItemWeight' | 'rarity' | 'type'
> & {
  quantity: number
}

export type InventoryItemList = InventoryItem[]
