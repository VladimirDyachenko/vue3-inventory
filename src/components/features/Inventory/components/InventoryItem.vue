<script setup lang="ts" generic="T extends InventoryItem">
import type { InventoryItem } from '@/types'
import { cva } from 'class-variance-authority'
import { Package } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const containerVariants = cva(
  'group relative flex flex-col lg:flex-row lg:items-center gap-3 p-3 bg-card border-l-4 rounded-lg transition-all duration-200 hover:bg-secondary shadow-lg',
  {
    variants: {
      rarity: {
        common: 'border-rarity-common',
        uncommon: 'border-rarity-uncommon',
        // TODO maybe add shadow based by rarity?
        rare: 'border-rarity-rare',
        epic: 'border-rarity-epic',
        legendary: 'border-rarity-legendary',
      },
    },
  },
)

const props = defineProps<{
  item: InventoryItem
}>()

const itemCount = computed(() =>
  props.item.quantity > 999 ? '1k+' : props.item.quantity.toString(),
)

const isImageLoadError = ref(false)
</script>

<template>
  <div :class="containerVariants({ rarity: props.item.rarity })">
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <slot name="actionInlineStart"></slot>
      <!-- Item image or fallback icon -->
      <div
        class="select-none flex-shrink-0 w-12 h-12 bg-secondary rounded-md flex items-center justify-center border border-border relative"
      >
        <img
          v-if="item.icon && isImageLoadError === false"
          :src="item.icon"
          :alt="item.name"
          class="w-8 h-8 object-contain"
          @error="isImageLoadError = true"
          @load="isImageLoadError = false"
        />
        <Package v-else class="w-6 h-6 text-muted-foreground" />

        <span
          v-if="item.quantity > 1"
          class="absolute top-0.5 right-0.5 grid min-h-6 min-w-6 translate-x-2/4 -translate-y-2/4 place-items-center rounded-full py-1 px-1 bg-primary text-primary-foreground text-xs tabular-nums font-bold"
        >
          {{ itemCount }}
        </span>
      </div>

      <!-- Main item info -->
      <div class="flex-1 min-w-0">
        <h3 class="text-sm font-semibold text-foreground truncate">
          {{ item.name }}
        </h3>
        <p class="text-xs text-muted-foreground capitalize">
          {{ item.rarity }}
        </p>
      </div>

      <div class="flex-shrink-0 text-right lg:mr-2">
        <span class="text-sm font-medium tabular-nums text-foreground">
          {{ (item.singleItemWeight * item.quantity).toFixed(1) }}
        </span>
        <span class="text-xs text-muted-foreground ml-1">кг</span>
      </div>
      <slot name="actionInlineEnd"></slot>
    </div>
    <slot name="actionsRow"></slot>
  </div>
</template>
