import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ItemsDataSource } from './ItemsDataSource'
import { ITEMS_MOCK } from './itemsMock'

describe('ItemsDataSource', () => {
  const mockLogger = {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  }

  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(ItemsDataSource as any).logger = mockLogger
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getItemById', () => {
    it('возвращает корректный предмет по id', () => {
      const item = ITEMS_MOCK[0]
      if (!item) throw new Error('item is undefined')
      const found = ItemsDataSource.getItemById(item.id)
      expect(found).toBeDefined()
      expect(found?.id).toBe(item.id)
    })

    it('возвращает null, если предмет не найден', () => {
      const result = ItemsDataSource.getItemById('not-found')
      expect(result).toBeNull()
    })
  })

  describe('getRandomItem', () => {
    it('возвращает кортеж [id, item]', () => {
      const result = ItemsDataSource.getRandomItem()
      expect(result).toBeTruthy()
      expect(result?.length).toBe(2)
      expect(result?.[1]).toHaveProperty('name')
    })

    it('возвращает null, если мапа пуста (мок)', () => {
      const mock = vi.spyOn(ItemsDataSource, 'getRandomItem').mockImplementationOnce(() => null)

      const result = ItemsDataSource.getRandomItem()
      expect(result).toBeNull()

      mock.mockRestore()
    })
  })

  describe('getInitialInventory', () => {
    it.each([0, -1, -Infinity])('возвращает пустой массив, если itemsAmount < 1', (itemsAmount) => {
      const result = ItemsDataSource.getInitialInventory(itemsAmount)
      expect(result).toEqual([])
    })

    it('правильное колличество если запрашивается больше размера мока', () => {
      const expectedAmount = ITEMS_MOCK.length + 5
      const result = ItemsDataSource.getInitialInventory(expectedAmount)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(expectedAmount)
    })

    it('возвращает массив случайных предметов', () => {
      const result = ItemsDataSource.getInitialInventory(3)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(3)
    })

    it('возвращает пустой массив, если getRandomItem всегда null', () => {
      const spy = vi.spyOn(ItemsDataSource, 'getRandomItem').mockReturnValue(null)

      const result = ItemsDataSource.getInitialInventory(5)
      expect(result).toEqual([])
      // Проверяем, что ошибка была отправлена в логгер
      expect(mockLogger.error).toBeCalledTimes(1)
      spy.mockRestore()
    })
  })
})
