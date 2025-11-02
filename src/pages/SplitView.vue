<script setup lang="ts">
import { AppNote, WithMainNavigation } from '@/components/atoms'
import { BarterInventory } from '@/components/features'
</script>

<template>
  <WithMainNavigation>
    <div class="px-6 pb-6">
      <div class="max-w-7xl mx-auto">
        <div class="mb-6">
          <h1 class="text-4xl font-bold text-foreground mb-2">Split View вариант</h1>
          <p class="text-muted-foreground">Два инвентаря рядом, например экран торговли</p>
        </div>
      </div>

      <BarterInventory remote-inventori-id="someIdFromQueryParams" />

      <AppNote class="max-w-7xl mt-8 mx-auto">
        <template #title>Кстати</template>
        При использовании ПКМ на кнопке продажи - добавляется модификатор количества
      </AppNote>
    </div>
  </WithMainNavigation>
</template>
