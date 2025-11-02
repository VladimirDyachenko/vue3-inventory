<script setup lang="ts">
import { AppButton, EmptyState } from '@/components/atoms'
import type { InventoryItemList } from '@/types'
import { pluralize } from '@/utils'
import { ArrowRight, Package, Weight } from 'lucide-vue-next'
import { computed } from 'vue'
import InventortItem from './InventoryItem.vue'

const props = defineProps<{
  title: string
  totalItems: number
  titalWeight: number
  items: InventoryItemList
  /*
   * self - инвентарь принадлежащий игроку
   */
  role: 'self' | 'another'
}>()

const emit = defineEmits<{
  onItemTransfer: [InventoryItemList[number], amount: number]
}>()

const slotName = computed(() => {
  return props.role === 'self' ? 'actionInlineEnd' : 'actionInlineStart'
})

const actionIconClass = computed(() => {
  if (props.role === 'another') {
    return 'rotate-180'
  }
  return undefined
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between border-b border-border pb-3">
      <div class="flex items-center gap-2">
        <Package class="w-5 h-5 text-primary" />
        <h3 class="text-lg font-bold text-foreground">{{ props.title }}</h3>
      </div>
      <div class="flex ml-auto gap-4">
        <div class="text-right">
          <p class="text-lg font-bold tabular-nums text-primary">
            {{ props.totalItems }}
          </p>
          <p class="text-[0.65rem] text-muted-foreground uppercase tracking-wider">
            {{ pluralize(props.totalItems, ['предмет', 'предмета', 'предметов']) }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-lg font-bold tabular-nums text-accent flex items-center gap-1 justify-end">
            <Weight class="w-4 h-4" />
            {{ props.titalWeight.toFixed(1) }}
          </p>
          <p class="text-[0.65rem] text-muted-foreground uppercase tracking-wider">Вес</p>
        </div>
      </div>
    </div>
    <div v-if="props.items.length > 0">
      <div class="space-y-3">
        <TransitionGroup name="list">
          <InventortItem v-for="item in props.items" :key="item.id" :item="item">
            <template v-slot:[slotName]>
              <AppButton
                @click="emit('onItemTransfer', item, 1)"
                @click.right.prevent="emit('onItemTransfer', item, item.quantity)"
                size="icon"
                variant="ghost"
                class="h-8 w-8 hover:bg-muted hover:text-accent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity touch:opacity-100"
                aria-label="Передать предмет"
              >
                <ArrowRight :class="['w-5 h-5 text-primary', actionIconClass]" />
              </AppButton>
            </template>
          </InventortItem>
        </TransitionGroup>
      </div>
    </div>
    <EmptyState v-else message="У вас нет предметов">
      <template #icon>
        <Package class="w-20 h-20 mx-auto mb-3 opacity-50" />
      </template>
    </EmptyState>
  </div>
</template>
