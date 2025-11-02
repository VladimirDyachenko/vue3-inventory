<script setup lang="ts">
import { cn } from '@/utils'
import type { ClassValue } from 'clsx'
import { useAttrs } from 'vue'
const props = defineProps<{ class?: ClassValue }>()
const attrs = useAttrs()
</script>

<template>
  <p v-bind="attrs" :class="cn('text-sm text-muted-foreground', props.class)">
    <slot></slot>
  </p>
</template>
