<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="text-center py-12 text-muted-foreground">
    <div v-if="$slots.icon" class="mb-3">
      <slot name="icon" />
    </div>

    <p class="text-sm">{{ message ?? 'Пустой список' }}</p>
  </div>
</template>
