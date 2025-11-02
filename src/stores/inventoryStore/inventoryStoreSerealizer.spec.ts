import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { InventoryItemList, ItemDto } from '@/types'
import { InventoryStoreSerealizer } from './inventoryStoreSerealizer'
import { ItemsDataSource } from '@/data-source'
import { getRandomIntInclusive } from '@/utils'

// для ItemsDataSource, мокаем только getItemById так как другие методы не используются
vi.mock('@/data-source', () => ({
  ItemsDataSource: {
    getItemById: vi.fn(),
  },
}))

describe('InventoryStoreSerealizer', () => {
  const mockLogger = {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  }

  const itemsDBMock: ItemDto[] = [
    {
      id: 'item-1',
      name: 'Предмет 1',
      rarity: 'rare',
      singleItemWeight: 3.5,
      icon: '/public/favicon.ico',
      type: 'consumable',
    },
    {
      id: 'item-2',
      name: 'Стальной меч',
      rarity: 'epic',
      singleItemWeight: 3.5,
      icon: '/public/favicon.ico',
      type: 'equipment',
    },
  ]

  const inventoryItemsMock: InventoryItemList = itemsDBMock.map((v) => ({
    ...v,
    quantity: getRandomIntInclusive(3, 5),
  }))

  const getItemById = (id: string) => itemsDBMock.find((v) => v.id === id) ?? null

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(InventoryStoreSerealizer as any).logger = mockLogger

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('serialize', () => {
    it('должен корректно сериализовать массив предметов в строку JSON', () => {
      const result = InventoryStoreSerealizer.serialize(inventoryItemsMock)
      expect(result).toBe(
        JSON.stringify(inventoryItemsMock.map((item) => [item.id, item.quantity])),
      )
    })

    it('должен вернуть null при ошибке сериализации (например, self ref или любая другая ошибка из-за JSON.stringify', () => {
      const spy = vi.spyOn(JSON, 'stringify').mockImplementation(() => {
        throw new Error('mocked JSON error')
      })

      const result = InventoryStoreSerealizer.serialize(inventoryItemsMock)
      expect(result).toBeNull()
      expect(mockLogger.error).toHaveBeenCalled()

      // restore original JSON.stringify after test
      spy.mockReset()
    })
  })

  describe('deserialize', () => {
    it('должен корректно десериализовать строку JSON в список предметов', () => {
      const itemQuantity = 50
      const item = itemsDBMock[0]
      if (!item) throw new Error('item = mockItems[0]; is undefined')

      vi.mocked(ItemsDataSource.getItemById).mockImplementation(getItemById)

      const input = JSON.stringify([[itemsDBMock[0]?.id, itemQuantity]])
      const result = InventoryStoreSerealizer.deserialize(input)

      expect(result).toEqual([{ ...item, quantity: itemQuantity }])
      expect(ItemsDataSource.getItemById).toHaveBeenCalledWith(item.id)
    })

    it('должен игнорировать неизвестные предметы', () => {
      const item = itemsDBMock[1]
      if (!item) throw new Error('"item = mockItems[0]" is undefined')

      vi.mocked(ItemsDataSource.getItemById).mockImplementation(getItemById)

      const input = JSON.stringify([
        ['unknown-item', 10],
        [item.id, 2],
      ])

      const result = InventoryStoreSerealizer.deserialize(input)

      expect(result).toHaveLength(1)
      expect(result?.[0]?.id).toBe(item.id)
    })

    it.each(['not-a-json', '', 1324, '{key: value}'])(
      'должен вернуть null при невалидном инпуте',
      (arg) => {
        const result = InventoryStoreSerealizer.deserialize(arg as unknown as string)
        expect(result).toBeNull()
        expect(mockLogger.error).toHaveBeenCalled()
      },
    )

    it('должен вернуть пустой массив при условии корректного ввода, но без существующих предметов', () => {
      vi.mocked(ItemsDataSource.getItemById).mockReturnValue(null)
      const result = InventoryStoreSerealizer.deserialize(JSON.stringify([['unknown-item', 1]]))
      expect(result).toEqual([])
    })
  })
})
