<script lang="ts" setup>
import {
  AppButton,
  AppCard,
  AppCardContent,
  AppCardDescription,
  AppCardHeader,
  AppCardTitle,
  EmptyState,
} from '@/components/atoms'
import { useInventoryStore } from '@/stores'
import { Minus, Package, Plus, Trash2, Weight } from 'lucide-vue-next'
import InventoryItem from '../components/InventoryItem.vue'

defineProps<{
  title: string
  description: string
}>()
const playerInventory = useInventoryStore()
</script>

<template>
  <AppCard class="border-border bg-card/50 backdrop-blur-sm">
    <AppCardHeader class="border-b border-border">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <AppCardTitle class="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package class="w-6 h-6 text-primary" />
            {{ title }}
          </AppCardTitle>
          <AppCardDescription v-if="description" class="mt-1">
            {{ description }}
          </AppCardDescription>
        </div>

        <div class="flex gap-4 justify-start md:justify-end">
          <div class="text-left md:text-right">
            <p class="text-xl font-bold text-primary tabular-nums">
              {{ playerInventory.totalItemsStats.itemsCount }}
            </p>
            <p class="text-xs text-muted-foreground uppercase tracking-wider">Предметов</p>
          </div>
          <div class="text-left md:text-right">
            <p class="text-xl font-bold text-accent flex items-center gap-1 tabular-nums">
              <Weight class="w-4 h-4" />
              {{ playerInventory.totalItemsStats.totalWeight.toFixed(1) }}
            </p>
            <p class="text-xs text-muted-foreground uppercase tracking-wider">Вес (кг)</p>
          </div>
        </div>
      </div>
    </AppCardHeader>

    <AppCardContent class="p-4">
      <div
        v-if="playerInventory.items.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
      >
        <TransitionGroup name="list">
          <InventoryItem v-for="item in playerInventory.items" :key="item.id" :item="item">
            <template #actionsRow>
              <div class="flex-shrink-0 flex items-center gap-1 justify-end lg:justify-start">
                <AppButton
                  size="icon"
                  variant="ghost"
                  class="h-8 w-8 hover:bg-muted hover:text-accent"
                  @click="playerInventory.addItem(item)"
                  @click.right.prevent="playerInventory.addItem(item, 10)"
                  aria-label="Добавить"
                >
                  <Plus class="h-4 w-4" />
                </AppButton>

                <AppButton
                  size="icon"
                  variant="ghost"
                  class="h-8 w-8 hover:bg-muted hover:text-accent"
                  @click="playerInventory.removeItemById(item.id)"
                  @click.right.prevent="playerInventory.removeItemById(item.id, 10)"
                  :disabled="item.quantity <= 1"
                  aria-label="Уменьшить"
                >
                  <Minus class="h-4 w-4" />
                </AppButton>

                <AppButton
                  size="icon"
                  variant="ghost"
                  class="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                  @click="playerInventory.removeAllItemsById(item.id)"
                  aria-label="Удалить"
                >
                  <Trash2 class="h-4 w-4" />
                </AppButton>
              </div>
            </template>
          </InventoryItem>
        </TransitionGroup>
      </div>
      <EmptyState v-else message="Контейнер пуст">
        <template #icon>
          <Package class="w-12 h-12 mx-auto mb-3 opacity-50" />
        </template>
      </EmptyState>
    </AppCardContent>
  </AppCard>
</template>
