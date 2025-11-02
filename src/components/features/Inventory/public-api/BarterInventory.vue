<script setup lang="ts">
import {
  AppButton,
  AppCard,
  AppCardContent,
  AppCardDescription,
  AppCardFootre,
  AppCardHeader,
  AppCardTitle,
} from '@/components/atoms'
import { useRemoteInventory, useErrorToast } from '@/composables'
import { useInventoryStore } from '@/stores'
import type { ItemDto } from '@/types'
import SplitInventory from '../components/SplitInventory.vue'

const props = defineProps<{ remoteInventoriId: string }>()

/*
 * Сейчас инвентарь торговца каждый запуск приложения создается с 0
 * В реальном мире эта страница бы принимала id второго инвентаря в пропах
 */
const playerInventory = useInventoryStore()
const merchantInventory = useRemoteInventory(props.remoteInventoriId)

const { toastVnode, showToast } = useErrorToast()

async function handleItemTransfer(transferType: 'sell' | 'buy', item: ItemDto, amount: number) {
  const method = transferType == 'sell' ? 'increase' : 'decrease'

  const result = await merchantInventory.safeMutate({
    method: method,
    amount: amount,
    itemId: item.id,
  })
  if (result.success === false) {
    showToast(result.message ?? 'Неизвестная ошибка')
    return
  }

  // Да, тут сперва должен быть оптимистик апдейт с ролбэком при неуспешном действии
  if (transferType === 'sell') {
    playerInventory.removeItemById(result.item.id, amount)
  } else {
    playerInventory.addItem(result.item, amount)
  }
}
</script>

<template>
  <AppCard class="border-border bg-card/50 backdrop-blur-sm max-w-7xl mx-auto">
    <AppCardHeader class="border-b border-border">
      <AppCardTitle class="text-2xl font-bold text-foreground">Передача предметов</AppCardTitle>
      <AppCardDescription class="mt-1">
        Перемещайте предметы между инвентарем и контейнером
      </AppCardDescription>
    </AppCardHeader>

    <AppCardContent class="p-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SplitInventory
          title="Инвентарь персонажа"
          :items="playerInventory.items"
          :totalItems="playerInventory.totalItemsStats.itemsCount"
          :titalWeight="playerInventory.totalItemsStats.totalWeight"
          @onItemTransfer="(item, amount) => handleItemTransfer('sell', item, amount)"
          role="self"
        />

        <div class="border border-border lg:hidden"></div>

        <SplitInventory
          title="Торговец Сидорович"
          :items="merchantInventory.itemsList.value"
          :totalItems="merchantInventory.stats.value.totalItems"
          :titalWeight="merchantInventory.stats.value.totalWeight"
          @onItemTransfer="(item, amount) => handleItemTransfer('buy', item, amount)"
          role="another"
        />
      </div>
    </AppCardContent>
    <AppCardFootre>
      <AppButton @click="handleItemTransfer('buy', { id: 'not-exist' } as any, 1)">
        Тригер ошибки
      </AppButton>
    </AppCardFootre>
  </AppCard>

  <component :is="toastVnode" />
</template>
