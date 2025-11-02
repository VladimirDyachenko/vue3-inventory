<script setup lang="ts">
import {
  AppButton,
  AppCard,
  AppCardContent,
  AppCardDescription,
  AppCardHeader,
  AppCardTitle,
  AppNote,
  WithMainNavigation,
} from '@/components/atoms'
import { PlayerInventory } from '@/components/features'
import { ItemsDataSource } from '@/data-source'
import { useInventoryStore } from '@/stores'

const playerInventory = useInventoryStore()

function handleAddRandomItem() {
  const itemToAdd = ItemsDataSource.getRandomItem()
  if (!itemToAdd) {
    return
  }

  playerInventory.addItem(itemToAdd[1])
}
</script>
<template>
  <WithMainNavigation>
    <div class="px-6 pb-6">
      <div class="max-w-7xl mx-auto space-y-6">
        <div class="mb-8">
          <h2 class="text-4xl font-bold text-foreground mb-2 break-words">Список контейнеров</h2>
          <p class="text-muted-foreground">Управление предметами по категориям</p>
        </div>

        <AppCard>
          <AppCardHeader>
            <AppCardTitle> Пример просмотра своего инвентаря </AppCardTitle>
            <AppCardDescription class="mt-1 flex flex-row flex-wrap gap-2 items-center">
              Этот инвентарь персистивный
            </AppCardDescription>
          </AppCardHeader>
          <AppCardContent>
            <AppButton @click="handleAddRandomItem"> Добавить случайный предмет </AppButton>
          </AppCardContent>
        </AppCard>

        <PlayerInventory
          title="Инвентарь игрока"
          description="Все ваши предметы в одном компоненте"
        />

        <AppNote class="max-w-7xl">
          <template #title>Кстати</template>
          При использвоании ПКМ на действии предмета - добавляется модификатор количества
        </AppNote>
      </div>
    </div>
  </WithMainNavigation>
</template>
