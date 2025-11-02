import { Logger } from '@/utils'
import { ref, watch, onMounted, onBeforeUnmount, type Ref, isRef } from 'vue'
const usePersistentStorageLogger = new Logger({ prefix: 'usePersistentStorageLogger' })

export type StorageType = 'local' | 'session'

interface UseLocalStorageOptions<T> {
  /**
   * Кастомный сериализатор, по умолчанию JSON.stringify
   */
  serialize?: (value: T) => string
  /**
   * Кастомный десериализатор, по умолчанию JSON.parse
   */
  deserialize?: (value: string) => T
  /**
   * Сохранять ли при изменении значения, по умолчанию true
   */
  autoSave?: boolean
  /**
   * Какой Storage использовать, может быть или session или local
   */
  type: StorageType
}

/**
 * Универсальный хук для реактивного сохранения данных
 *
 * @export
 * @template T
 * @param {string} key ключ для сохранения
 * @param {Ref<T>} defaultValue значение для инициализации
 * @param {UseLocalStorageOptions<T>} options
 * @returns {Ref<T>}
 */
export function usePersistentStorage<T>(
  key: string,
  defaultValue: Ref<T>,
  options: UseLocalStorageOptions<T>,
): Ref<T> {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    autoSave = true,
    type = 'local',
  } = options

  const data = isRef(defaultValue) ? defaultValue : ref(defaultValue)

  // Хелпер для получения верного инстанса стора
  const getStorage = (): Storage => {
    return type === 'local' ? localStorage : sessionStorage
  }

  // инициализация стора
  const load = () => {
    try {
      const storage = getStorage()
      const stored = storage.getItem(key) ?? ''

      const deserializez = deserialize(stored)
      data.value = deserializez
    } catch (err) {
      usePersistentStorageLogger.error(`load failed for ${key}`, err)
    }
  }

  // сохранение в сторадж
  const save = (value: T) => {
    const serialized = serialize(value)
    try {
      const storage = getStorage()
      storage.setItem(key, serialized)
    } catch (err) {
      usePersistentStorageLogger.error(`save failed for ${key}`, err)
    }
  }

  // обновление при мутации данных
  watch(
    data,
    (val) => {
      if (autoSave) save(val)
    },
    { deep: true },
  )

  /**
   * Функция для синхронизации данных, если в стор было что-то
   * записано в другой вкладке браузера
   * @param {StorageEvent} e
   */
  const handleStorageUpdate = (e: StorageEvent) => {
    // Проверяем, что событие из правильного типа хранилища
    if (e.storageArea !== getStorage()) return

    if (e.key === key && e.newValue) {
      try {
        data.value = deserialize(e.newValue)
      } catch {
        usePersistentStorageLogger.error(`faild to sync key: ${e.key}`)
      }
    }
  }

  onMounted(() => {
    load()
    window.addEventListener('storage', handleStorageUpdate)
  })
  onBeforeUnmount(() => window.removeEventListener('storage', handleStorageUpdate))

  return data
}
