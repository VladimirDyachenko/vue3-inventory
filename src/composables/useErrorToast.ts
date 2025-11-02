import { AppButton } from '@/components/atoms'
import { TriangleAlert, XIcon } from 'lucide-vue-next'
import { h, onBeforeUnmount, ref, Teleport, Transition } from 'vue'

/**
 * Вот прямо самый базовый минимум для отоброжения тостов.
 * В реальном проекте это должно быть отдельным компонентом, подключеным к оверлэю,
 * со своим стором, где будет централизованая логика их создания, менеджмента состояния,
 * это позволит адекватно хэндлить стэйт уведомлений.
 * Например, приостанавливать их закрытие при наведении курсора, добавлять колбэки на дейсвтия
 * И тогда у нас будет удобный API для отображения этих уведомлений
 * Но в рамках тестового проекта, давайте договоримся, что мы тут пробывали api порталов и создания динамических компонентов
 *
 * Но без подковырки не обошлось, например, мы не хотим каждый раз писать телепорты и шаблон самого тоста
 * Поэтому тут возвращается VNode'а, которую мы можем ``<component :is="toastVnode" />``
 *
 * вот так просто отобразить в компоненте
 * @export
 * @returns {{ toastMessage: any; showToast: (message: string, duration?: number) => void; closeToast: () => void; }}
 */
export function useErrorToast() {
  const toastMessage = ref<string | undefined>(undefined)
  let hideTimeout: ReturnType<typeof setTimeout> | null = null

  function cleanUp() {
    if (hideTimeout) {
      clearInterval(hideTimeout)
    }
    toastMessage.value = undefined
  }

  function showToast(message: string, duration = 5000) {
    // отменяем предыдущий таймер, чтобы уведомление не закрылось раньше времени
    if (hideTimeout) {
      cleanUp()
    }

    toastMessage.value = `[${new Date().toLocaleTimeString()}] ${message}`
    hideTimeout = setTimeout(cleanUp, duration)
  }

  function closeToast() {
    if (hideTimeout) {
      cleanUp()
    }
  }

  onBeforeUnmount(closeToast)

  const toastVnode = h(
    Teleport,
    { to: 'body' },
    h(
      Transition,
      {
        'enter-active-class': 'transition-opacity duration-300',
        'enter-from-class': 'opacity-0',
        'enter-to-class': 'opacity-100',
        'leave-active-class': 'transition-opacity duration-300',
        'leave-from-class': 'opacity-100',
        'leave-to-class': 'opacity-0',
      },
      {
        default: () => {
          if (!toastMessage.value) return null

          return h(
            'div',
            {
              class:
                'fixed max-w-7xl left-4 mx-auto right-4 top-16 z-50 bg-destructive text-destructive-foreground px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg',
            },
            [
              h(TriangleAlert, { class: 'text-destructive' }),
              h(
                'p',
                { class: 'text-destructive-foreground' },
                toastMessage.value ?? 'Ошибка при передаче предмета',
              ),
              h(
                AppButton,
                {
                  class: 'ml-auto hover:bg-primary rounded-xl',
                  variant: 'ghost',
                  size: 'icon',
                  onClick: closeToast,
                },
                { default: () => h(XIcon) },
              ),
            ],
          )
        },
      },
    ),
  )

  return { toastVnode, showToast, closeToast, toastMessage }
}

// Пример использвоание тоста в sfc компонентах
// <Teleport to="body">
//   <Transition
//     enter-active-class="transition-opacity duration-300"
//     enter-from-class="opacity-0"
//     enter-to-class="opacity-100"
//     leave-active-class="transition-opacity duration-300"
//     leave-from-class="opacity-100"
//     leave-to-class="opacity-0"
//   >
//     <div
//       v-if="toastMessage"
//       class="fixed max-w-7xl left-4 mx-auto right-4 top-16 z-50 bg-destructive text-destructive-foreground px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg"
//     >
//       <TriangleAlert class="text-destructive" />
//       <p class="text-destructive-foreground">
//         {{ toastMessage ?? 'Ошибка при передаче предмета' }}
//       </p>

//       <AppButton
//         class="ml-auto hover:bg-primary rounded-xl"
//         variant="ghost"
//         size="icon"
//         @click="closeToast"
//       >
//         <XIcon />
//       </AppButton>
//     </div>
//   </Transition>
// </Teleport>
