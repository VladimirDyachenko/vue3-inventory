<script setup lang="ts">
import { InfoIcon } from 'lucide-vue-next'
import { AppCard, AppCardContent, AppCardHeader, AppCardTitle } from './AppCard'
</script>

<template>
  <AppCard>
    <AppCardHeader>
      <AppCardTitle class="flex flex-row flex-wrap gap-2">
        <InfoIcon class="text-accent w-6 h-6" />
        <slot name="title"></slot>
      </AppCardTitle>
    </AppCardHeader>
    <AppCardContent>
      <div class="flex flex-row flex-wrap gap-2 items-center">
        <p>
          <slot></slot>
        </p>
      </div>
    </AppCardContent>
  </AppCard>
</template>
